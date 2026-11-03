const { chromium } = require("playwright")
const fs = require("node:fs/promises")
const path = require("node:path")
const assert = require("node:assert/strict")

const url = process.env.TEST_URL || "http://localhost:4174/"
const out = process.env.TEST_OUTPUT_DIR || path.resolve(__dirname, "../../../tmp/v10-qa")
const widths = [320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920]
const sections = ["#top", "#about", "#solutions", "#how-it-works", "#product", "#features", "#industries", "#faq", "#contact"]

;(async () => {
  await fs.mkdir(out, { recursive: true })

  let browser
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true })
  } catch {
    browser = await chromium.launch({ headless: true })
  }

  const rows = []
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
    await page.goto(url, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const selector of sections) {
        await page.locator(selector).scrollIntoViewIfNeeded()
        const result = await page.evaluate((sectionSelector) => {
          const section = document.querySelector(sectionSelector)
          if (!section) return { section: sectionSelector, missing: true }

          const bodyWidth = document.documentElement.scrollWidth
          const clipped = [...section.querySelectorAll("h1,h2,h3,p,a,button,figcaption")]
            .filter((element) => {
              const textNodes = []
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
              while (walker.nextNode()) {
                if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode)
              }

              return textNodes.some((node) => {
                const range = document.createRange()
                range.selectNodeContents(node)
                const textRects = [...range.getClientRects()]
                let ancestor = node.parentElement

                while (ancestor && ancestor !== section.parentElement) {
                  // Slides outside the carousel viewport are intentionally scrollable.
                  if (ancestor.matches(".solution-carousel__viewport")) break
                  const style = getComputedStyle(ancestor)
                  const bounds = ancestor.getBoundingClientRect()
                  const clipsX = ["hidden", "clip"].includes(style.overflowX)
                  const clipsY = ["hidden", "clip"].includes(style.overflowY)

                  if (textRects.some((textRect) =>
                    (clipsX && (textRect.left < bounds.left - 1 || textRect.right > bounds.right + 1)) ||
                    (clipsY && (textRect.top < bounds.top - 1 || textRect.bottom > bounds.bottom + 1))
                  )) return true

                  if (ancestor === section) break
                  ancestor = ancestor.parentElement
                }

                return false
              })
            })
            .map((element) => element.className || element.tagName.toLowerCase())

          const columns = [...section.children].filter((element) => {
            const style = getComputedStyle(element)
            return style.display === "grid" || style.display === "flex"
          })

          return {
            section: sectionSelector,
            missing: false,
            width: innerWidth,
            overflow: bodyWidth > innerWidth,
            documentWidth: bodyWidth,
            clipped,
            imageFailures: [...section.querySelectorAll("img")]
              .filter((image) => image.complete && !image.naturalWidth)
              .map((image) => image.getAttribute("src")),
            headings: [...section.querySelectorAll("h1,h2,h3")].length,
            layoutRoots: columns.length,
          }
        }, selector)

        rows.push({ viewport: width, ...result })
        assert.equal(result.missing, false, JSON.stringify(result))
        assert.equal(result.overflow, false, JSON.stringify(result))
        assert.deepEqual(result.clipped, [], JSON.stringify(result))
        assert.deepEqual(result.imageFailures, [], JSON.stringify(result))
      }

      if ([320, 390, 768, 1024, 1440, 1920].includes(width)) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
        await page.screenshot({
          path: path.join(out, "full-" + width + ".png"),
          fullPage: true,
          animations: "disabled",
        })
      }
      console.log("PASS responsive layout at", width)
    }

    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => {
        document.documentElement.classList.toggle("dark", value === "dark")
        localStorage.setItem("deeptrace-theme", value)
      }, theme)
      await page.waitForTimeout(60)
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
        await page.screenshot({
          path: path.join(out, "full-" + theme + "-" + width + ".png"),
          fullPage: true,
          animations: "disabled",
        })
      }
    }

    await fs.writeFile(path.join(out, "visual-qa.json"), JSON.stringify(rows, null, 2))
    console.log("PASS", rows.length, "viewport-section checks")
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
