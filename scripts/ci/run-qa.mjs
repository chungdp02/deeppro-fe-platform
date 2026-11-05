import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdir, appendFile, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'

const suite = process.env.QA_SUITE || 'verify'
const files = { verify: 'verify.cjs', visual: 'visual.cjs', perf: 'run-lighthouse.cjs' }
if (!Object.hasOwn(files, suite)) throw new Error('Unknown QA_SUITE')
const app = resolve('apps/web')
const out = resolve('tmp/ci', suite)
await mkdir(out, { recursive: true })
const require = createRequire(resolve(app, 'package.json'))
const vite = resolve(require.resolve('vite/package.json'), '../bin/vite.js')
const preview = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { cwd: app })
let exited = false
let announced = false
preview.on('exit', () => { exited = true })
for (const stream of [preview.stdout, preview.stderr]) {
  stream.on('data', chunk => { announced ||= chunk.toString().includes('http://127.0.0.1:4174/'); process.stdout.write(chunk); void appendFile(resolve(out, 'preview.log'), chunk) })
}
const url = 'http://127.0.0.1:4174/'
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    if (exited) throw new Error('Preview exited before readiness')
    try { ready = (await fetch(url, { signal: AbortSignal.timeout(1000) })).ok } catch { /* retry until deadline */ }
    if (ready && announced && !exited) break
    ready = false
    await setTimeout(500)
  }
  if (!ready) throw new Error('Preview readiness timed out')
  const env = { ...process.env, TEST_URL: url, TEST_OUTPUT_DIR: out }
  if (suite === 'perf') env.CHROME_PATH = require('playwright').chromium.executablePath()
  const test = spawn(process.execPath, [resolve(app, 'tests', files[suite])], { cwd: app, env, stdio: ['ignore', 'pipe', 'pipe'] })
  for (const stream of [test.stdout, test.stderr]) {
    stream.on('data', chunk => { process.stdout.write(chunk); void appendFile(resolve(out, 'suite.log'), chunk) })
  }
  const code = await new Promise((res, rej) => { test.once('error', rej); test.once('exit', res) })
  if (code !== 0) throw new Error(`${suite} failed (${code}); see ${out}`)
  if (process.env.GITHUB_STEP_SUMMARY) {
    const report = suite === 'perf' ? await readFile(resolve(out, 'v10-performance-summary.json'), 'utf8') : `${suite}: PASS (see uploaded JSON and screenshots)`
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `\n### Landing ${suite}\n\n${report}\n`)
  }
} finally {
  preview.kill()
}
