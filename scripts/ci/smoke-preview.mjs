import { readFile, appendFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
const url = new URL((await readFile(process.env.PREVIEW_URL_FILE, 'utf8')).trim())
if (url.protocol !== 'https:' || !url.hostname.endsWith('.vercel.app')) throw new Error('Unexpected Preview URL')
const { chromium } = createRequire(resolve('apps/web/package.json'))('playwright')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('response', r => { if (r.url().startsWith(url.origin + '/assets/') && !r.ok()) errors.push(`Asset HTTP ${r.status()}`) })
  const response = await page.goto(url.href, { waitUntil: 'networkidle', timeout: 60000 })
  if (!response?.ok() || !(await page.title()).includes('DeepTrace')) throw new Error('Preview HTML unavailable')
  await page.locator('h1').waitFor()
  const initialHeading = await page.locator('h1').innerText()
  await page.locator('.language-switcher').first().click()
  await page.waitForFunction(initial => document.querySelector('h1')?.innerText !== initial, initialHeading)
  await page.locator('.language-switcher').first().click()
  await page.locator('a[href="#how-it-works"]').first().click()
  if (!(await page.locator('#how-it-works').count())) throw new Error('Missing journey anchor')
  if (!(await page.locator('a[href*="/login"]').count())) throw new Error('Missing login CTA')
  if (errors.length) throw new Error(JSON.stringify(errors))
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `Preview smoke PASS: ${url.href}\nCommit: ${process.env.GITHUB_SHA}\n`)
} finally { await browser.close() }
