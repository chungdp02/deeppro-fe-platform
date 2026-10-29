const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const url = process.env.TEST_URL || 'http://localhost:4174/';
const out = process.env.TEST_OUTPUT_DIR || path.resolve(__dirname, '../../../tmp/v4-qa');
const results = [];
const errors = [];
const warnings = [];
const expectedWarnings = [];
let testingContextLoss = false;
const shell = '.trace-scene-shell';
const canvas = '.trace-scene__canvas canvas';
const stages = '.trace-scene__stages button';

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, status: 'PASS', detail });
    console.log('PASS', name, JSON.stringify(detail ?? {}));
  } catch (e) {
    results.push({ name, status: 'FAIL', error: e.message });
    console.error('FAIL', name, e.message);
  }
}

async function ready(page) {
  await page.locator(`${shell}[data-scene-phase="ready"]`).waitFor({ timeout: 30000 });
  await page.waitForTimeout(1200);
}

async function waitForStableFrameCount(page, selector, quietMs = 600) {
  const deadline = Date.now() + 6000;
  let previous = null;
  let stableSince = Date.now();

  while (Date.now() < deadline) {
    const current = await page.locator(selector).getAttribute('data-rendered-frames');
    if (current !== previous) {
      previous = current;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= quietMs) {
      return current;
    }
    await page.waitForTimeout(100);
  }

  throw new Error(`Frame count did not settle for ${selector}`);
}

function track(page) {
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
    if (m.type() === 'warning') {
      if (testingContextLoss && m.text().includes('WEBGL_lose_context extension not supported')) {
        expectedWarnings.push(m.text());
      } else {
        warnings.push(m.text());
      }
    }
  });
}

async function stage(page, index) {
  await page.locator(`${shell}[data-selected-stage="${index}"]`).waitFor({ timeout: 6000 });
}

(async () => {
  await fs.mkdir(out, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    track(page);
    await page.goto(url, { waitUntil: 'networkidle' });

    await check('Desktop automatically loads real WebGL2', async () => {
      await ready(page);
      return await page.locator(canvas).evaluate((c) => ({
        webgl2: !!c.getContext('webgl2'),
        engine: c.dataset.engine,
        frames: c.dataset.renderedFrames,
        calls: c.dataset.drawCalls,
        triangles: c.dataset.triangles,
      })).then((d) => {
        assert(d.webgl2);
        assert(Number(d.frames) >= 30);
        return d;
      });
    });

    await check('Real idle animation changes canvas pixels', async () => {
      const a = await page.locator(canvas).screenshot({ path: path.join(out, 'motion-frame-a.png') });
      await page.waitForTimeout(700);
      const b = await page.locator(canvas).screenshot({ path: path.join(out, 'motion-frame-b.png') });
      const hash = (v) => crypto.createHash('sha256').update(v).digest('hex');
      assert.notEqual(hash(a), hash(b));
      return { frameA: hash(a), frameB: hash(b) };
    });

    await page.screenshot({ path: path.join(out, 'desktop-1440.png') });

    await check('Pointer movement changes camera', async () => {
      await page.mouse.move(1040, 400);
      await page.waitForTimeout(900);
      const before = await page.locator(canvas).getAttribute('data-camera-position');
      const box = await page.locator(canvas).boundingBox();
      await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.15);
      await page.waitForFunction(
        ({ selector, before }) => document.querySelector(selector).getAttribute('data-camera-position') !== before,
        { selector: canvas, before },
        { timeout: 6000 }
      );
      return { before, after: await page.locator(canvas).getAttribute('data-camera-position') };
    });

    await check('Keyboard stage selection and camera transition', async () => {
      const before = await page.locator(canvas).getAttribute('data-camera-position');
      await page.locator(stages).first().focus();
      await page.locator(stages).first().press('End');
      await stage(page, 3);
      assert.match(await page.locator('#trace-stage-detail').innerText(), /Zalo/);
      await page.waitForFunction(
        ({ selector, before }) => document.querySelector(selector).getAttribute('data-camera-position') !== before,
        { selector: canvas, before }
      );
      assert.equal(await page.locator(stages).nth(3).evaluate((e) => e === document.activeElement), true);
      return { selected: 3, camera: await page.locator(canvas).getAttribute('data-camera-position') };
    });

    await check('3D mesh hotspot can be picked', async () => {
      await page.locator(stages).first().click();
      await stage(page, 0);
      await page.mouse.move(1040, 400);
      await page.waitForTimeout(1300);
      const box = await page.locator(canvas).boundingBox();
      await page.locator(canvas).click({ position: { x: box.width * 0.78, y: box.height * 0.78 } });
      await stage(page, 2);
      return { selected: 2 };
    });

    await check('Pause stops continuous frame rendering', async () => {
      await page.getByRole('button', { name: 'Dừng chuyển động', exact: true }).click();
      await page.waitForTimeout(400);
      assert.equal(await page.locator(canvas).getAttribute('data-animated'), 'false');
      const a = await page.locator(canvas).getAttribute('data-rendered-frames');
      await page.waitForTimeout(800);
      assert.equal(await page.locator(canvas).getAttribute('data-rendered-frames'), a);
      await page.getByRole('button', { name: 'Bật chuyển động', exact: true }).click();
      return { pausedFrames: a };
    });

    await check('Scroll selects Production and moves the same scene', async () => {
      await page.locator('#journey-production').evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await stage(page, 1);
      await page.waitForTimeout(900);
      assert.equal(await page.locator(canvas).isVisible(), true);
      await page.screenshot({ path: path.join(out, 'journey-production.png') });
      return { stage: 1, canvasCount: await page.locator(canvas).count(), camera: await page.locator(canvas).getAttribute('data-camera-position') };
    });

    await check('Offscreen scene pauses and resumes', async () => {
      await page.locator('#industries').evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForFunction((selector) => document.querySelector(selector)?.dataset.animated === 'false', canvas);
      await page.waitForTimeout(500);
      const a = await page.locator(canvas).getAttribute('data-rendered-frames');
      await page.waitForTimeout(600);
      assert.equal(await page.locator(canvas).getAttribute('data-rendered-frames'), a);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction((selector) => document.querySelector(selector)?.dataset.animated === 'true', canvas);
      return { offscreenFrames: a };
    });

    await check('Slow chapter boundary scrolling stays monotonic in both directions', async () => {
      const centers = await page.locator('[data-journey-stage]').evaluateAll((es) =>
        es.map((e) => {
          const r = e.getBoundingClientRect();
          return scrollY + r.top + r.height / 2 - innerHeight / 2;
        })
      );
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), centers[0]);
      await stage(page, 0);
      const forward = [];
      const back = [];
      for (let y = centers[0]; y <= centers[3]; y += 90) {
        await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(100);
        forward.push(Number(await page.locator(shell).getAttribute('data-selected-stage')));
      }
      for (let y = centers[3]; y >= centers[0]; y -= 90) {
        await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(100);
        back.push(Number(await page.locator(shell).getAttribute('data-selected-stage')));
      }
      assert(forward.every((v, i) => i === 0 || v >= forward[i - 1]), JSON.stringify(forward));
      assert(back.every((v, i) => i === 0 || v <= back[i - 1]), JSON.stringify(back));
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      return { forward, back };
    });

    testingContextLoss = true;
    await check('Context loss shows fallback; context restoration renders again', async () => {
      await page.locator(canvas).evaluate((c) => {
        window.__qaContextExtension = c.getContext('webgl2').getExtension('WEBGL_lose_context');
        window.__qaContextExtension.loseContext();
      });
      await page.locator(`${shell}[data-scene-phase="lost"]`).waitFor();
      assert.equal(await page.locator('.trace-fallback').evaluate((e) => getComputedStyle(e).visibility), 'visible');
      await page.screenshot({ path: path.join(out, 'context-loss-fallback.png') });
      await page.waitForTimeout(600);
      await page.evaluate(() => window.__qaContextExtension.restoreContext());
      await ready(page);
      return { recovered: true };
    });

    await check('Context loss retry creates a working replacement canvas', async () => {
      await page.locator(canvas).evaluate((c) => c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
      await page.locator(`${shell}[data-scene-phase="lost"]`).waitFor();
      await page.getByRole('button', { name: 'Thử lại 3D', exact: true }).click();
      await ready(page);
      return { recovered: true };
    });

    await check('Theme, FAQ and link targets remain functional', async () => {
      await page.locator('button.theme-toggle').first().click();
      assert.equal(await page.locator('html').evaluate((e) => e.classList.contains('dark')), true);
      await page.screenshot({ path: path.join(out, 'desktop-dark.png') });
      await page.locator('button.theme-toggle').first().click();
      await page.locator('.faq-item summary').first().click();
      assert.equal(await page.locator('.faq-item').first().evaluate((e) => e.open), true);
      await page.locator('.faq-item summary').first().click();
      assert.equal(await page.locator('.faq-item').first().evaluate((e) => e.open), false);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="#"]')]
          .map((e) => e.getAttribute('href'))
          .filter((h) => h.length > 1 && !document.getElementById(h.slice(1)))
      );
      assert.deepEqual(bad, []);
      assert.equal(
        await page.locator('.trace-intro__actions a').first().getAttribute('href'),
        'https://deeptrace.deepprotech.com/login?redirect=%2Fproduct'
      );
      return { badAnchors: bad };
    });

    await check('Brand 3D loads near the section and honors reduced motion', async () => {
      const brandPage = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce',
      });
      const sceneRequests = [];
      brandPage.on('request', (request) => {
        if (/TrustStructureScene-.*\.js/.test(request.url())) sceneRequests.push(request.url());
      });
      track(brandPage);

      try {
        await brandPage.goto(url, { waitUntil: 'networkidle' });
        assert.equal(sceneRequests.length, 0, 'brand scene should not load at the top of the page');

        await brandPage.locator('.why-deeptrace__visual-wrap').evaluate((element) =>
          element.scrollIntoView({ block: 'center', behavior: 'instant' })
        );
        const selector = '.why-deeptrace__3d-canvas canvas';
        const canvasElement = brandPage.locator(selector);
        await canvasElement.waitFor({ state: 'visible' });
        await brandPage.waitForFunction(
          (canvasSelector) => Number(document.querySelector(canvasSelector)?.dataset.renderedFrames) >= 1,
          selector
        );

        assert(sceneRequests.length > 0, 'brand scene bundle should load near its section');
        assert.equal(await canvasElement.getAttribute('data-animated'), 'false');
        const visibleFrames = await canvasElement.getAttribute('data-rendered-frames');
        await brandPage.waitForTimeout(500);
        assert.equal(await canvasElement.getAttribute('data-rendered-frames'), visibleFrames);

        await brandPage.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await brandPage.waitForFunction(
          (canvasSelector) => document.querySelector(canvasSelector)?.dataset.visible === 'false',
          selector
        );
        const offscreenFrames = await canvasElement.getAttribute('data-rendered-frames');
        await brandPage.waitForTimeout(500);
        assert.equal(await canvasElement.getAttribute('data-rendered-frames'), offscreenFrames);
        return { sceneRequests: sceneRequests.length, visibleFrames, offscreenFrames };
      } finally {
        await brandPage.close();
      }
    });

    await context.close();
    testingContextLoss = false;

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const mobile = await mobileContext.newPage();
    track(mobile);
    const mobileRequests = [];
    mobile.on('request', (r) => mobileRequests.push(r.url()));
    await mobile.goto(url, { waitUntil: 'networkidle' });
    await mobile.waitForTimeout(1000);

    await check('Mobile first load uses fallback and downloads no 3D', async () => {
      assert.equal(await mobile.locator(shell).getAttribute('data-scene-phase'), 'poster');
      assert.equal(mobileRequests.some((r) => /TraceabilityScene-/.test(r)), false);
      await mobile.screenshot({ path: path.join(out, 'mobile-390.png') });
      return { threeRequested: false };
    });

    await check('Mobile menu, keyboard dismissal and touch theme work', async () => {
      await mobile.getByRole('button', { name: 'Mở menu', exact: true }).click();
      assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      await mobile.locator('.theme-toggle--menu').tap();
      assert(await mobile.locator('html').evaluate((e) => e.classList.contains('dark')));
      await mobile.locator('.theme-toggle--menu').tap();
      await mobile.locator('.menu-toggle').press('Escape');
      assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.equal(await mobile.locator('.menu-toggle').evaluate((e) => e === document.activeElement), true);
      assert.equal(await mobile.locator('#mobile-menu').evaluate((e) => e.inert), true);
      return { escapeFocus: true };
    });

    await check('Mobile explicit opt-in uses DPR 1 and touch hotspots', async () => {
      await mobile.getByRole('button', { name: 'Khám phá 3D', exact: true }).tap();
      await ready(mobile);
      const dpr = await mobile.locator(canvas).evaluate((c) => c.width / c.getBoundingClientRect().width);
      assert(dpr <= 1.01);
      await mobile.locator(stages).nth(3).tap();
      await stage(mobile, 3);
      await mobile.locator(shell).evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await mobile.screenshot({ path: path.join(out, 'mobile-3d.png') });
      return { dpr, triangles: await mobile.locator(canvas).getAttribute('data-triangles') };
    });

    await check('Mobile menu dismisses before focus is obscured and on desktop resize', async () => {
      await mobile.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await mobile.getByRole('button', { name: 'Mở menu', exact: true }).click();
      await mobile.locator('.mobile-menu__cta').focus();
      await mobile.locator('.mobile-menu__cta').press('Tab');
      assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.equal(await mobile.locator('body').evaluate((e) => e.style.overflow), '');
      await mobile.getByRole('button', { name: 'Mở menu', exact: true }).click();
      await mobile.locator('.brand').focus();
      await mobile.locator('.brand').press('Shift+Tab');
      assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await mobile.getByRole('button', { name: 'Mở menu', exact: true }).click();
      await mobile.setViewportSize({ width: 1440, height: 900 });
      await mobile.waitForTimeout(200);
      assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.equal(await mobile.locator('body').evaluate((e) => e.style.overflow), '');
      return { tabDismissed: true, shiftTabDismissed: true, resizeDismissed: true };
    });
    await mobileContext.close();

    const reducedContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
    });
    const reduced = await reducedContext.newPage();
    track(reduced);
    await reduced.goto(url, { waitUntil: 'networkidle' });

    await check('Reduced motion keeps a static, interactive 3D view', async () => {
      assert.equal(await reduced.locator(shell).getAttribute('data-scene-phase'), 'poster');
      await reduced.getByRole('button', { name: /Khám phá 3D/ }).click();
      await ready(reduced);
      assert.equal(await reduced.locator(canvas).getAttribute('data-animated'), 'false');
      const before = await waitForStableFrameCount(reduced, canvas);
      await reduced.waitForTimeout(800);
      assert.equal(await reduced.locator(canvas).getAttribute('data-rendered-frames'), before);
      await reduced.locator(stages).nth(2).click();
      await stage(reduced, 2);
      const a = await waitForStableFrameCount(reduced, canvas);
      await reduced.waitForTimeout(600);
      assert.equal(await reduced.locator(canvas).getAttribute('data-rendered-frames'), a);
      await reduced.screenshot({ path: path.join(out, 'reduced-motion.png') });
      return { framesAtRest: a };
    });

    await check('Nine responsive widths have no overflow or hero overlap', async () => {
      const measurements = [];
      for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1600, 1920]) {
        await reduced.setViewportSize({ width, height: 900 });
        await reduced.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await reduced.waitForTimeout(150);
        const m = await reduced.evaluate(() => {
          const rect = (s) => document.querySelector(s).getBoundingClientRect();
          const a = rect('.trace-intro h1');
          const b = rect('.trace-scene__viewport');
          return {
            width: innerWidth,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            heroOverlap: a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
            clippedStageButtons: [...document.querySelectorAll('.trace-scene__stages button')].filter(
              (e) => e.scrollWidth > e.clientWidth + 1
            ).length,
          };
        });
        measurements.push(m);
        assert.equal(m.overflow, false, `overflow at ${width}`);
        assert.equal(m.heroOverlap, false, `hero overlap at ${width}`);
        assert.equal(m.clippedStageButtons, 0, `clipped controls at ${width}`);
        await reduced.screenshot({ path: path.join(out, `responsive-${width}.png`) });
      }
      await fs.writeFile(path.join(out, 'responsive.json'), JSON.stringify(measurements, null, 2));
      return measurements;
    });

    await reduced.setViewportSize({ width: 1440, height: 1000 });
    await reduced.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await reduced.screenshot({ path: path.join(out, 'full-desktop.png'), fullPage: true });

    await reduced.setViewportSize({ width: 390, height: 844 });
    await reduced.screenshot({ path: path.join(out, 'full-mobile.png'), fullPage: true });
    await reducedContext.close();

    const unsupported = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await unsupported.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
        return original.call(this, type, ...args);
      };
    });
    await unsupported.goto(url, { waitUntil: 'networkidle' });

    await check('Unsupported WebGL preserves all semantic controls', async () => {
      await unsupported.locator(`${shell}[data-scene-phase="unsupported"]`).waitFor();
      assert.equal(await unsupported.locator(canvas).count(), 0);
      await unsupported.locator(stages).nth(1).click();
      await stage(unsupported, 1);
      assert.match(await unsupported.locator('#trace-stage-detail').innerText(), /mobile/);
      await unsupported.screenshot({ path: path.join(out, 'webgl-unsupported.png') });
      return { stage: 1, canvas: false };
    });
    await unsupported.close();

    const saveData = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await saveData.addInitScript(() =>
      Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true })
    );
    const saveRequests = [];
    saveData.on('request', (r) => saveRequests.push(r.url()));
    await saveData.goto(url, { waitUntil: 'networkidle' });
    await saveData.waitForTimeout(1200);

    await check('Save-Data prevents automatic 3D transfer', async () => {
      assert.equal(await saveData.locator(shell).getAttribute('data-scene-phase'), 'poster');
      assert.equal(saveRequests.some((r) => /TraceabilityScene-/.test(r)), false);
      return { threeRequested: false };
    });
    await saveData.close();

    await check('Failed 3D chunk keeps content; explicit reload recovers', async () => {
      const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      const failures = [];
      p.on('console', (m) => {
        if (m.type() === 'error') failures.push(m.text());
      });
      try {
        await p.route('**/assets/TraceabilityScene-*.js', (r) => r.abort());
        await p.goto(url, { waitUntil: 'networkidle' });
        await p.locator(`${shell}[data-scene-phase="error"]`).waitFor();
        assert(await p.locator('.trace-intro h1').isVisible());
        await p.locator(stages).nth(2).click();
        await stage(p, 2);
        await p.unroute('**/assets/TraceabilityScene-*.js');
        await Promise.all([
          p.waitForNavigation({ waitUntil: 'networkidle' }),
          p.getByRole('button', { name: 'Tải lại trang', exact: true }).click(),
        ]);
        await ready(p);
        return { recovered: true, expectedFailureLogs: failures.length };
      } finally {
        await p.close();
      }
    });

    await check('Loss and retry cancel an unfinished shader warmup', async () => {
      const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      const pendingErrors = [];
      p.on('pageerror', (e) => pendingErrors.push(e.message));
      try {
        await p.goto(url, { waitUntil: 'domcontentloaded' });
        await p.locator(canvas).waitFor({ state: 'attached' });
        assert.equal(await p.locator(shell).getAttribute('data-scene-phase'), 'loading');
        await p.locator(canvas).evaluate((c) =>
          c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()
        );
        await p.locator(`${shell}[data-scene-phase="lost"]`).waitFor();
        await p.getByRole('button', { name: 'Thử lại 3D', exact: true }).click();
        await ready(p);
        await p.waitForTimeout(500);
        assert.deepEqual(pendingErrors, []);
        return { interruptedBeforeReady: true, retried: true, errors: pendingErrors };
      } finally {
        await p.close();
      }
    });

    await check('Prerendered headline, CTA and chapters work without JavaScript', async () => {
      const p = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
      try {
        await p.goto(url, { waitUntil: 'networkidle' });
        assert(await p.locator('h1').isVisible());
        assert.equal(await p.locator('[data-journey-stage]').count(), 4);
        assert.equal(await p.locator(canvas).count(), 0);
        assert.equal(
          await p.locator('.trace-intro__actions a').first().getAttribute('href'),
          'https://deeptrace.deepprotech.com/login?redirect=%2Fproduct'
        );
        await p.screenshot({ path: path.join(out, 'no-javascript.png') });
        return { chapters: 4 };
      } finally {
        await p.close();
      }
    });

    await check('Normal flows have no runtime errors or warnings', async () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(warnings, []);
      return { errors, warnings };
    });
  } finally {
    await browser.close();
    await fs.writeFile(
      path.join(out, 'verification.json'),
      JSON.stringify({ results, errors, warnings, expectedWarnings }, null, 2)
    );
    console.log(`${results.filter((r) => r.status === 'PASS').length}/${results.length} checks passed`);
    if (results.some((r) => r.status === 'FAIL')) process.exitCode = 1;
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
