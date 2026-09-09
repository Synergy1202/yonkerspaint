/* Build integrity gate. Everything here is about what leaves the machine:
   that the deployable files are present, that nothing withdrawn or internal
   is in the output, and that the sitemap points only at things that exist.

   Fails loudly. Run: npm run check:dist (part of check:all) */
const fs = require('fs');
const path = require('path');
const { walk } = require('./refs.js');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');

if (!fs.existsSync(SITE)) {
  console.error('_site/ not found. Run `npm run build` first.');
  process.exit(1);
}

let problems = 0;
const note = (ok, msg) => { if (!ok) problems++; console.log('  ' + (ok ? 'OK  ' : 'FAIL') + '  ' + msg); };

const files = walk(SITE);                 // paths like "/index.html"
const set = new Set(files);

/* ---- 1. required deployables --------------------------------------- */
console.log('\n1. Required files present in the build');
const REQUIRED = [
  '/.htaccess',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/404.html',
  '/thanks.html',
  '/index.html',
  '/css/site.css',
  '/js/site.js'
];
for (const f of REQUIRED) note(set.has(f), f);

/* ---- 2. nothing withdrawn or held may ship -------------------------- */
console.log('\n2. No withdrawn or held images in the build');
const md = fs.readFileSync(path.join(ROOT, 'IMAGE-MANIFEST.md'), 'utf8');
const rowRe = /^\| `([a-z0-9-]+\.webp)` \| (DSC\d+\.jpg) \| (.*?) \| (.*?) \| (\d+)×(\d+) \| (.*?) \| (.*?) \|$/gm;
const blocked = [];
let m;
while ((m = rowRe.exec(md)) !== null) {
  if (/do not place|HELD/i.test(m[7])) blocked.push(m[1]);
}
/* If the parse finds nothing, that is a broken regex, not a clean manifest. */
note(blocked.length > 0,
  `manifest parsed: ${blocked.length} withdrawn/held row(s) identified` +
  (blocked.length ? '' : ' — PARSE FAILURE, cannot vouch for the build'));
for (const b of blocked) {
  const hits = files.filter(f => f.endsWith('/' + b));
  note(hits.length === 0, `${b} absent${hits.length ? ' — FOUND AT ' + hits.join(', ') : ''}`);
}

/* ---- 3. no internal paths ------------------------------------------ */
console.log('\n3. No internal directories in the build');
for (const word of ['triage', 'gbp', 'dropbox', 'review-kit', 'node_modules']) {
  const hits = files.filter(f => f.toLowerCase().split('/').includes(word));
  note(hits.length === 0, `no path segment "${word}"${hits.length ? ' — ' + hits.slice(0, 3).join(', ') : ''}`);
}

/* ---- 4. sitemap points only at real files --------------------------- */
console.log('\n4. Sitemap URLs resolve to files in the build');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', '_data', 'site.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1]);
note(locs.length > 0, `${locs.length} <loc> entries found`);
for (const loc of locs) {
  note(loc.startsWith(site.origin), `${loc} uses the canonical origin`);
  let p = loc.slice(site.origin.length) || '/';
  if (p.endsWith('/')) p += 'index.html';
  note(set.has(p), `${p} exists in the build`);
}

/* ---- 5. sitemap must not list noindex pages ------------------------- */
console.log('\n5. Sitemap excludes noindex pages');
for (const p of ['/404.html', '/thanks.html']) {
  const listed = locs.some(l => l.endsWith(p));
  note(!listed, `${p} not in the sitemap`);
}

/* ---- 6. robots.txt points at the real sitemap ----------------------- */
console.log('\n6. robots.txt');
const robots = fs.readFileSync(path.join(SITE, 'robots.txt'), 'utf8');
note(robots.includes(site.origin + '/sitemap.xml'), 'Sitemap line matches the canonical origin');

console.log('\n' + (problems === 0
  ? `PASS: build is deployable. ${files.length} files.`
  : `FAIL: ${problems} problem(s) — do not deploy.`));
process.exit(problems === 0 ? 0 : 1);
