const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

const url = process.env.TEST_URL || 'http://localhost:4174/';
const out = process.env.TEST_OUTPUT_DIR || path.resolve(__dirname, '../../../tmp/v4-qa');
const sections = ['#solutions', '#product', '#features', '#industries', '.why-deeptrace', '#faq', '#contact'];
const pairs = [
  ['.solutions-section__intro', '.solutions-section__visual'],
  ['.product-showcase__intro', '.trace-preview'],
  ['.feature-story', '.feature-copy'],
  ['.faq-section__intro', '.faq-list'],
  ['.contact-section__copy', '.contact-section__visual'],
];

(async () => {
  await fs.mkdir(out, { recursive: true });

  let b;
  try {
    b = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    b = await chromium.launch({ headless: true });
  }

  const rows = [];
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await p.goto(url, { waitUntil: 'networkidle' });

    for (const width of [320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920]) {
      await p.setViewportSize({ width, height: 900 });
      for (const selector of sections) {
        await p.locator(selector).evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await p.waitForTimeout(140);
        const row = await p.evaluate(
          ({ selector, pairs }) => {
            const hit = (a, b) => {
              if (!a || !b) return false;
              const x = a.getBoundingClientRect(),
                y = b.getBoundingClientRect();
              return x.left < y.right - 1 && x.right > y.left + 1 && x.top < y.bottom - 1 && x.bottom > y.top + 1;
            };
            const section = document.querySelector(selector);
            const collisions = pairs.filter(([a, b]) => {
              const x = section.querySelector(a),
                y = section.querySelector(b);
              return hit(x, y);
            });
            const industries = [...section.querySelectorAll('.industry-story')].filter((e) =>
              hit(e.querySelector('.industry-story__art'), e.querySelector('.industry-story__copy'))
            ).length;
            const clipped = [...section.querySelectorAll('h2,h3,p,button')]
              .filter((e) => e.getBoundingClientRect().width > 0 && e.scrollWidth > e.clientWidth + 1)
              .map((e) => e.className || e.tagName);
            const faqQuestion = section.querySelector('.faq-item__question');
            const faqSummary = faqQuestion?.closest('summary');
            const faqQuestionWidthRatio = faqQuestion && faqSummary
              ? faqQuestion.getBoundingClientRect().width / faqSummary.getBoundingClientRect().width
              : null;
            const logo = document.querySelector('.brand__logo').getBoundingClientRect();
            return {
              width: innerWidth,
              selector,
              overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
              collisions,
              industryCollisions: industries,
              clipped,
              faqQuestionWidthRatio,
              logoRatio: logo.width / logo.height,
            };
          },
          { selector, pairs }
        );
        rows.push(row);
        assert(!row.overflow, JSON.stringify(row));
        assert(!row.collisions.length, JSON.stringify(row));
        assert.equal(row.industryCollisions, 0, JSON.stringify(row));
        assert(!row.clipped.length, JSON.stringify(row));
        if (selector === '#faq') assert(row.faqQuestionWidthRatio > 0.6, JSON.stringify(row));
        assert(Math.abs(row.logoRatio - 180 / 46) < 0.03, JSON.stringify(row));
        if ([390, 1024, 1440].includes(width)) {
          await p.screenshot({ path: path.join(out, `section-${width}-${selector.replace(/[#.]/g, '')}.png`) });
        }
      }
      console.log(`PASS all lower sections at ${width}`);
    }

    for (const [width, height] of [
      [1440, 1000],
      [390, 844],
    ]) {
      await p.setViewportSize({ width, height });
      await p.addStyleTag({
        content: 'section{content-visibility:visible!important;contain-intrinsic-size:none!important}',
      });
      for (let y = 0; y < (await p.evaluate(() => document.documentElement.scrollHeight)); y += 650) {
        await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y);
        await p.waitForTimeout(70);
      }
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await p.waitForTimeout(250);
      await p.screenshot({ path: path.join(out, `full-realized-${width}.png`), fullPage: true });
    }

    const dark = await b.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', reducedMotion: 'reduce' });
    await dark.goto(url, { waitUntil: 'networkidle' });
    for (const selector of sections) {
      await dark.locator(selector).evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await dark.waitForTimeout(120);
      await dark.screenshot({ path: path.join(out, `section-dark-${selector.replace(/[#.]/g, '')}.png`) });
    }
    await fs.writeFile(path.join(out, 'visual-qa.json'), JSON.stringify(rows, null, 2));
    console.log(`PASS ${rows.length} viewport/section combinations`);
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
