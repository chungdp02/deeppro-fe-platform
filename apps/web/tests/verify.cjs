const { chromium } = require("playwright")
const fs = require("node:fs/promises")
const path = require("node:path")
const assert = require("node:assert/strict")

const url = process.env.TEST_URL || "http://localhost:4174/"
const out = process.env.TEST_OUTPUT_DIR || path.resolve(__dirname, "../../../tmp/v10-qa")
const results = []
const runtimeErrors = []
const requestedThreeResources = []

async function check(name, fn) {
  try {
    const detail = await fn()
    results.push({ name, status: "PASS", detail: detail || null })
    console.log("PASS", name, JSON.stringify(detail || {}))
  } catch (error) {
    results.push({ name, status: "FAIL", error: error.message })
    console.error("FAIL", name, error.message)
  }
}

;(async () => {
  await fs.mkdir(out, { recursive: true })

  let browser
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true })
  } catch {
    browser = await chromium.launch({ headless: true })
  }

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })
    page.on("pageerror", (error) => runtimeErrors.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text())
    })
    page.on("request", (request) => {
      if (/three|react-three|TraceabilityScene|TrustStructureScene/i.test(request.url())) {
        requestedThreeResources.push(request.url())
      }
    })

    await page.goto(url, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)

    await check("Hero and page metadata describe DeepTrace", async () => {
      const title = await page.title()
      const h1 = await page.locator("h1").allTextContents()
      const description = await page.locator('meta[name="description"]').getAttribute("content")
      assert.match(title, /DeepTrace/)
      assert.equal(h1.length, 1)
      assert.match(h1[0], /Truy xuất nguồn gốc\.\s*Ứng dụng Blockchain\./)
      assert.ok(description && description.includes("hành trình truy xuất nguồn gốc"))
      return { title, h1: h1[0].replace(/\s+/g, " ").trim(), description }
    })

    await check("Hero uses matching responsive image candidates and preloads", async () => {
      const sources = await page.locator(".hero__visual source").evaluateAll((nodes) =>
        nodes.map((node) => ({
          media: node.media,
          srcSet: node.srcset,
          sizes: node.sizes,
        }))
      )
      const desktopImage = await page.locator(".hero__visual img").evaluate((node) => ({
        srcSet: node.srcset,
        sizes: node.sizes,
        currentSrc: new URL(node.currentSrc).pathname,
      }))
      const preloads = await page.locator('link[rel="preload"][as="image"]').evaluateAll((nodes) =>
        nodes.map((node) => ({
          media: node.media,
          srcSet: node.getAttribute("imagesrcset"),
          sizes: node.getAttribute("imagesizes"),
        }))
      )

      assert.equal(sources.length, 1)
      assert.match(sources[0].srcSet, /480w.*672w.*960w/)
      assert.equal(sources[0].sizes, "calc(100vw - 40px)")
      assert.match(desktopImage.srcSet, /480w.*960w.*1440w.*1920w/)
      assert.equal(desktopImage.sizes, "52vw")
      assert.ok(preloads.some((preload) => preload.media === sources[0].media && preload.srcSet === sources[0].srcSet))
      assert.ok(preloads.some((preload) => preload.media === "(min-width: 981px)" && preload.srcSet === desktopImage.srcSet))
      return { mobileCandidates: 3, desktopCandidates: 4, currentSrc: desktopImage.currentSrc }
    })

    await check("All navigation anchors resolve to real page sections", async () => {
      const missing = await page.locator('a[href^="#"]').evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href) => href && href !== "#" && !document.querySelector(href))
      )
      assert.deepEqual(missing, [])
      return { localAnchorCount: await page.locator('a[href^="#"]').count() }
    })

    await check("Shared shadcn primitives are used in the page", async () => {
      const sharedButtons = await page.locator('button[data-slot="button"]').count()
      const cards = await page.locator('[data-slot="card"]').count()
      const badges = await page.locator('[data-slot="badge"]').count()
      assert.ok(sharedButtons >= 3, "Expected menu, theme, and carousel pause buttons")
      assert.ok(cards >= 5, "Expected cards in value, industry, and passport sections")
      assert.ok(badges >= 1, "Expected the product demo badge")
      return { sharedButtons, cards, badges }
    })

    await check("Traceability journey exposes four complete stacking panels", async () => {
      const panels = page.locator(".journey-panel")
      assert.equal(await panels.count(), 4)
      for (let index = 0; index < 4; index += 1) {
        await panels.nth(index).scrollIntoViewIfNeeded()
        assert.ok((await panels.nth(index).innerText()).length > 100)
        assert.ok(await panels.nth(index).locator("img").getAttribute("alt"))
      }
      return { panels: 4 }
    })

    await check("FAQ uses accessible native disclosures", async () => {
      const items = page.locator(".faq-item")
      assert.equal(await items.count(), 6)
      const first = items.first()
      await first.locator("summary").click()
      assert.equal(await first.evaluate((element) => element.open), true)
      assert.ok((await first.innerText()).includes("DeepTrace là nền tảng"))
      return { questions: await items.count(), firstOpen: true }
    })

    await check("Passport preview labels demonstration data and has no fake QR", async () => {
      const demo = page.locator('[data-ui="product-passport"]')
      await demo.scrollIntoViewIfNeeded()
      assert.ok(await demo.getByText("Chuẩn VietGAP").count())
      assert.ok((await demo.innerText()).includes("DeepTrace Passport"))
      assert.ok((await demo.innerText()).includes("GS1"))
      assert.ok((await demo.innerText()).includes("Dữ liệu minh họa"))
      assert.equal(await demo.locator("canvas, svg.qr-code, [aria-label*='QR code']").count(), 0)
      assert.equal(await page.locator("h1").count(), 1)
      return { demoLabel: "Chuẩn VietGAP", qrGenerated: false }
    })

    await check("Theme toggle changes the semantic theme", async () => {
      const root = page.locator("html")
      const wasDark = await root.evaluate((element) => element.classList.contains("dark"))
      await page.locator(".site-header .theme-toggle").click()
      const isDark = await root.evaluate((element) => element.classList.contains("dark"))
      assert.notEqual(isDark, wasDark)
      const foreground = await page.locator("body").evaluate((element) => getComputedStyle(element).color)
      assert.ok(foreground)
      return { wasDark, isDark, foreground }
    })

    await check("Navigation links and contact destinations remain available", async () => {
      assert.equal(
        await page.locator('a[href^="https://deeptrace.deepprotech.com/login"]').count() > 0,
        true
      )
      assert.equal(await page.locator('a[href="tel:+84926422522"]').count() > 0, true)
      assert.equal(await page.locator('a[href="mailto:contact@deepprotech.com"]').count(), 1)
      return {
        login: true,
        phone: true,
        email: true,
      }
    })

    await check("Images load successfully when their sections are reached", async () => {
      const images = page.locator("main img")
      const count = await images.count()
      const failed = []
      for (let index = 0; index < count; index += 1) {
        const image = images.nth(index)
        if (await image.isVisible() && !(await image.evaluate((element) => Boolean(element.closest(".journey-panel, .solution-carousel"))))) await image.scrollIntoViewIfNeeded()
        else await image.evaluate((element) => { element.loading = "eager" })
        await image.evaluate((element) => element.decode())
        const state = await image.evaluate((element) => ({
          src: new URL(element.currentSrc || element.src).pathname,
          width: element.naturalWidth,
          height: element.naturalHeight,
        }))
        if (!state.width || !state.height) failed.push(state.src)
      }
      assert.deepEqual(failed, [])
      return { imageCount: count, failed }
    })

    await check("No Three.js or WebGL resources are requested", async () => {
      assert.deepEqual(requestedThreeResources, [])
      assert.equal(await page.locator("canvas").count(), 0)
      return { requestedThreeResources, canvases: 0 }
    })

    await check("Mobile Sheet opens, navigates, closes, and returns focus", async () => {
      await page.setViewportSize({ width: 390, height: 844 })
      const menuButton = page.getByRole("button", { name: "Mở menu" })
      await menuButton.click()
      const sheet = page.locator("#mobile-menu")
      await sheet.waitFor({ state: "visible" })
      assert.equal(await sheet.getAttribute("aria-modal"), "true")
      await page.getByRole("link", { name: "Quy trình" }).click()
      await sheet.waitFor({ state: "hidden" })
      assert.equal(new URL(page.url()).hash, "#how-it-works")
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
      await page.getByRole("button", { name: "Mở menu" }).click()
      await sheet.waitFor({ state: "visible" })
      await page.keyboard.press("Escape")
      await sheet.waitFor({ state: "hidden" })
      const focusReturned = await page.evaluate(() =>
        document.activeElement?.classList.contains("menu-toggle")
      )
      assert.equal(focusReturned, true)
      return { opened: true, navigated: "#how-it-works", escapeClosed: true, focusReturned }
    })

    await check("Page copy preserves original DeepTrace content and Blockchain claims", async () => {
      const content = await page.locator("main").textContent()
      assert.ok(content.includes("Blockchain"), "Expected Blockchain technology claims")
      assert.ok(content.includes("GS1"), "Expected GS1 standards")
      assert.ok(content.includes("TCVN 12850"), "Expected TCVN 12850 standards")
      assert.ok(content.includes("VietGAP"), "Expected VietGAP standards")
      assert.ok(content.includes("Hộ chiếu sản phẩm số"), "Expected digital product passport copy")
      assert.ok(content.includes("Zalo Mini App"), "Expected Zalo Mini App reference")
      return { originalClaimsPreserved: true }
    })

    await check("Shared UI dark utilities follow the selected theme, independently of the OS", async () => {
      const backgrounds = {}
      for (const os of ["light", "dark"]) {
        for (const selected of ["light", "dark"]) {
          const probePage = await browser.newPage({ colorScheme: os, reducedMotion: "reduce" })
          try {
            await probePage.addInitScript((theme) => localStorage.setItem("deeptrace-theme", theme), selected)
            await probePage.goto(url, { waitUntil: "networkidle" })
            const background = await probePage.evaluate((theme) => {
              const probe = document.createElement("div")
              // Use existing Button outline utility classes without app-specific CSS overrides.
              probe.className = "bg-background dark:bg-input/30"
              document.body.appendChild(probe)
              const reference = document.createElement("div")
              reference.style.backgroundColor = theme === "dark"
                ? "color-mix(in oklab, var(--input) 30%, transparent)"
                : "var(--background)"
              document.body.appendChild(reference)
              const result = {
                actual: getComputedStyle(probe).backgroundColor,
                expected: getComputedStyle(reference).backgroundColor,
              }
              probe.remove()
              reference.remove()
              return result
            }, selected)
            assert.equal(background.actual, background.expected, `${os}/${selected}: expected selected-theme utility`)
            backgrounds[`${os}/${selected}`] = background.actual
          } finally {
            await probePage.close()
          }
        }
      }
      assert.equal(backgrounds["light/light"], backgrounds["dark/light"])
      assert.equal(backgrounds["light/dark"], backgrounds["dark/dark"])
      assert.notEqual(backgrounds["light/light"], backgrounds["light/dark"])
      return backgrounds
    })

    await check("Browser reports no runtime or console errors", async () => {
      assert.deepEqual(runtimeErrors, [])
      return { runtimeErrors }
    })

    const report = { url, results, runtimeErrors, requestedThreeResources }
    await fs.writeFile(path.join(out, "functional-qa.json"), JSON.stringify(report, null, 2))
    if (results.some((result) => result.status === "FAIL")) process.exitCode = 1
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
