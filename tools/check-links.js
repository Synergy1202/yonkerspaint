/* Crawls _site/ for broken internal links and missing asset references.
   Pass bar is zero of each: the ~100 broken references the audit found must
   all be resolved or removed.

   Reference collection lives in tools/refs.js, shared with the prune step in
   .eleventy.js, so the build and the check agree on what "referenced" means.

   Run: npm run check   (after npm run build) */
const fs = require('fs');
const path = require('path');
const { resolve, assetRefsIn, EXTERNAL } = require('./refs.js');
const { walk } = require('./refs.js');

const SITE = path.join(__dirname, '..', '_site');
const problems = { links: [], images: [], anchors: [], other: [] };
const counted = { pages: 0, links: 0, assets: 0 };

if (!fs.existsSync(SITE)) {
  console.error('_site/ not found. Run `npm run build` first.');
  process.exit(1);
}

const files = new Set(walk(SITE));
const htmlFiles = [...files].filter(f => f.endsWith('.html'));

/* ids present per page, for #anchor checking */
const idsByPage = {};
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(SITE, f), 'utf8');
  idsByPage[f] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
}

/* redirects declared in .htaccess count as valid targets */
const redirects = new Set();
if (files.has('/.htaccess')) {
  const ht = fs.readFileSync(path.join(SITE, '.htaccess'), 'utf8');
  for (const m of ht.matchAll(/^Redirect\s+301\s+(\S+)/gm)) redirects.add(m[1]);
}

/* ---- crawl ----------------------------------------------------------- */
for (const page of htmlFiles) {
  counted.pages++;
  const html = fs.readFileSync(path.join(SITE, page), 'utf8');

  // internal href targets
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const ref = m[1];
    if (EXTERNAL.test(ref) || ref.startsWith('#')) {
      if (ref.startsWith('#') && ref !== '#') {
        counted.links++;
        if (!idsByPage[page].has(ref.slice(1))) {
          problems.anchors.push(`${page} -> ${ref} (no such id on page)`);
        }
      }
      continue;
    }
    counted.links++;
    const { file, hash } = resolve(ref, page);
    if (redirects.has(file)) continue;
    if (!files.has(file)) {
      problems.links.push(`${page} -> ${ref} (missing ${file})`);
    } else if (hash && idsByPage[file] && !idsByPage[file].has(hash)) {
      problems.anchors.push(`${page} -> ${ref} (no id "${hash}" in ${file})`);
    }
  }

  // asset references (shared collector)
  for (const ref of assetRefsIn(html)) {
    if (EXTERNAL.test(ref)) continue;
    counted.assets++;
    const { file } = resolve(ref, page);
    if (!files.has(file)) problems.images.push(`${page} -> ${ref} (missing ${file})`);
  }

  // an <img> with no alt attribute at all
  for (const m of html.matchAll(/<img(?![^>]*\salt=)[^>]*>/g)) {
    problems.other.push(`${page} -> <img> with no alt attribute: ${m[0].slice(0, 80)}`);
  }
}

/* ---- stylesheets: @font-face and background-image ------------------- */
for (const f of [...files].filter(x => x.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(SITE, f), 'utf8');
  for (const m of css.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)) {
    if (EXTERNAL.test(m[1])) continue;
    counted.assets++;
    const { file } = resolve(m[1], f);
    if (!files.has(file)) problems.images.push(`${f} -> ${m[1]} (missing ${file})`);
  }
}

/* ---- report ---------------------------------------------------------- */
const label = { links: 'BROKEN INTERNAL LINKS', images: 'MISSING ASSET REFERENCES',
                anchors: 'BROKEN #ANCHORS', other: 'OTHER' };
let total = 0;
for (const k of ['links', 'images', 'anchors', 'other']) {
  const list = problems[k];
  total += list.length;
  console.log(`\n${label[k]}: ${list.length}`);
  list.forEach(x => console.log('  ' + x));
}

console.log(`\nCrawled ${counted.pages} pages, ${counted.links} links, ${counted.assets} asset refs.`);
console.log(total === 0 ? '\nPASS: zero broken links, zero missing assets.'
                        : `\nFAIL: ${total} problem(s).`);
process.exit(total === 0 ? 0 : 1);
