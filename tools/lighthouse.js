/* Runs Lighthouse against the local preview and prints a score table.
   Usage: node tools/lighthouse.js <outDir> [port]
   Requires Chrome and a server already running on the port. */
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'triage/lh';
const PORT = process.argv[3] || '8099';
const PAGES = process.argv[4] ? process.argv[4].split(',')
  : ['index', 'departments', 'guides/wall-anchors', 'services'];
fs.mkdirSync(OUT, { recursive: true });
const rows = [];
for (const p of PAGES) {
  const json = path.join(OUT, p.replace(/\//g,'-') + '.json');
  try {
    execFileSync('npx', ['-y', 'lighthouse', `http://localhost:${PORT}/${p}.html`,
      '--quiet', '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json', '--output-path=' + json, '--preset=desktop'],
      { stdio: ['ignore', 'ignore', 'ignore'], shell: true, timeout: 180000 });
    const r = JSON.parse(fs.readFileSync(json, 'utf8'));
    const s = c => Math.round((r.categories[c].score || 0) * 100);
    rows.push({ page: p + '.html', perf: s('performance'), a11y: s('accessibility'),
                bp: s('best-practices'), seo: s('seo') });
  } catch (e) {
    rows.push({ page: p + '.html', perf: 'ERR', a11y: 'ERR', bp: 'ERR', seo: 'ERR' });
  }
}
const w = (s, n) => String(s).padEnd(n);
console.log(w('page', 20) + w('perf', 7) + w('a11y', 7) + w('best-prac', 11) + 'seo');
console.log('-'.repeat(50));
for (const r of rows) console.log(w(r.page, 20) + w(r.perf, 7) + w(r.a11y, 7) + w(r.bp, 11) + r.seo);
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(rows, null, 1));
