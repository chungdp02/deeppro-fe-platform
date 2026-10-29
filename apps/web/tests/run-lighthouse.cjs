const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const outputRoot = path.resolve(
  process.env.TEST_OUTPUT_DIR || path.resolve(__dirname, '../../../tmp/v4-qa')
);
const outDir = path.join(outputRoot, 'lighthouse', 'v5');
fs.mkdirSync(outDir, { recursive: true });

const url = process.env.TEST_URL || 'http://localhost:4174/';
const metricIds = {
  lcp: 'largest-contentful-paint',
  fcp: 'first-contentful-paint',
  tbt: 'total-blocking-time',
  cls: 'cumulative-layout-shift',
};

function runAudit(profile, index) {
  const outputPath = path.join(outDir, `v5-${profile}-${index}.json`);
  console.log(`Running Lighthouse ${profile} audit ${index}/3...`);
  const cmd = `corepack pnpm dlx lighthouse@13.5.0 ${url} --preset=${profile === 'perf' ? 'perf' : 'desktop'} --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="${outputPath}" "--only-categories=performance,accessibility,best-practices,seo"`;
  execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '../..') });
  return outputPath;
}

function parseRun(filePath) {
  const r = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    file: path.basename(filePath),
    performance: Math.round((r.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((r.categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((r.categories['best-practices']?.score ?? 0) * 100),
    seo: Math.round((r.categories.seo?.score ?? 0) * 100),
    lcp: r.audits['largest-contentful-paint']?.numericValue ?? 0,
    fcp: r.audits['first-contentful-paint']?.numericValue ?? 0,
    tbt: r.audits['total-blocking-time']?.numericValue ?? 0,
    cls: r.audits['cumulative-layout-shift']?.numericValue ?? 0,
    benchmark: r.environment?.benchmarkIndex ?? 0,
    chrome: r.environment?.hostUserAgent ?? '',
  };
}

function calculateStats(runs) {
  const stats = {};
  for (const key of ['performance', 'accessibility', 'bestPractices', 'seo', 'lcp', 'fcp', 'tbt', 'cls', 'benchmark']) {
    const values = runs.map((r) => r[key]).sort((a, b) => a - b);
    stats[key] = {
      median: values[1],
      min: values[0],
      max: values[2],
    };
  }
  return stats;
}

(async () => {
  const results = { mobile: { runs: [] }, desktop: { runs: [] } };

  for (let i = 1; i <= 3; i++) {
    const filePath = runAudit('perf', i);
    results.mobile.runs.push(parseRun(filePath));
  }
  results.mobile.stats = calculateStats(results.mobile.runs);

  for (let i = 1; i <= 3; i++) {
    const filePath = runAudit('desktop', i);
    results.desktop.runs.push(parseRun(filePath));
  }
  results.desktop.stats = calculateStats(results.desktop.runs);

  const dist = path.resolve(__dirname, '../dist');
  const assetFiles = fs.readdirSync(path.join(dist, 'assets')).filter((n) => /\.(js|css)$/.test(n));
  results.bundle = assetFiles.map((name) => {
    const data = fs.readFileSync(path.join(dist, 'assets', name));
    return { name, bytes: data.length, gzip: zlib.gzipSync(data).length };
  });
  const html = fs.readFileSync(path.join(dist, 'index.html'));
  results.bundle.push({
    name: 'index.html (prerendered, CSS inline)',
    bytes: html.length,
    gzip: zlib.gzipSync(html).length,
  });

  const summaryPath = path.join(outputRoot, 'v5-performance-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log('\n=== V5 LIGHTHOUSE AUDIT SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
})();
