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

    await check("Language toggle switches bilingual content between Vietnamese and English", async () => {
      const root = page.locator("html")
      const switcher = page.locator(".site-header .language-switcher")
      assert.equal(await root.getAttribute("lang"), "vi")

      // Click chuyển sang tiếng Anh
      await switcher.click()
      await page.waitForTimeout(150)
      assert.equal(await root.getAttribute("lang"), "en")
      const h1TextEn = await page.locator("h1").innerText()
      assert.ok(h1TextEn.includes("Transparent Traceability"), "Expected English hero headline")

      // Click chuyển lại tiếng Việt
      await switcher.click()
      await page.waitForTimeout(150)
      assert.equal(await root.getAttribute("lang"), "vi")
      const h1TextVi = await page.locator("h1").innerText()
      assert.ok(h1TextVi.includes("Truy xuất nguồn gốc"), "Expected Vietnamese hero headline")

      return { switchedToEn: true, switchedBackToVi: true }
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

    await check("Page strictly enforces Light theme and never applies dark class", async () => {
      for (const os of ["light", "dark"]) {
        const probePage = await browser.newPage({ colorScheme: os, reducedMotion: "reduce" })
        try {
          await probePage.goto(url, { waitUntil: "networkidle" })
          const rootClass = await probePage.locator("html").getAttribute("class")
          assert.equal(rootClass.includes("dark"), false, `${os}: should not have dark class`)
          assert.equal(rootClass.includes("light"), true, `${os}: should have light class`)
        } finally {
          await probePage.close()
        }
      }
      return { lightThemeLocked: true }
    })

    await check("Interactive Product Lookup switches products, shows empty state, and handles QR scanner dialog", async () => {
      const demo = page.locator('[data-ui="product-passport"]')
      const input = page.locator("#trace-code-input")
      const submitBtn = page.locator(".product-lookup-form__submit")
      const resetBtn = page.locator(".product-lookup-form__reset")
      const scanBtn = page.locator(".product-lookup-form__scan")

      // 1. Kiểm tra hiển thị mặc định của thẻ hộ chiếu
      assert.ok((await demo.innerText()).includes("Chuẩn VietGAP"))
      assert.ok((await demo.innerText()).includes("DeepTrace Passport"))

      // 2. Click chip sản phẩm dược phẩm "PHARMA-2026-X1"
      const pharmaChip = page.locator(".chip-button").filter({ hasText: "PHARMA-2026-X1" })
      await pharmaChip.click()
      await page.waitForTimeout(300)
      assert.ok((await demo.innerText()).includes("Chuẩn GSP Y Tế"))
      assert.ok((await demo.innerText()).includes("MediBio"))

      // 3. Nhập mã không tồn tại -> kiểm tra empty state
      await input.fill("UNKNOWN-999")
      await submitBtn.click()
      await page.waitForTimeout(300)
      assert.ok((await demo.innerText()).includes("Không tìm thấy thông tin sản phẩm"))
      assert.ok(await page.locator("#lookup-feedback").count() > 0)

      // 4. Click nút reset để quay lại mặc định
      await resetBtn.click()
      await page.waitForTimeout(100)
      assert.ok((await demo.innerText()).includes("Chuẩn VietGAP"))

      // 5. Mở và đóng QR Scanner Dialog
      await scanBtn.click()
      const dialog = page.locator(".qr-scanner-dialog")
      await dialog.waitFor({ state: "visible", timeout: 2000 })
      assert.ok((await dialog.innerText()).includes("Quét mã QR truy xuất"))

      // Nhấn Escape để đóng dialog
      await page.keyboard.press("Escape")
      await dialog.waitFor({ state: "hidden", timeout: 2000 })

      return {
        productSwitchPass: true,
        emptyStatePass: true,
        resetPass: true,
        qrDialogPass: true,
      }
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
