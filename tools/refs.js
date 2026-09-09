/* Shared reference collection for _site/.
   One implementation, used by both the prune step (.eleventy.js) and the
   crawl (tools/check-links.js), so the two can never disagree about what
   "referenced" means. */
const fs = require('fs');
const path = require('path');

function walk(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base + '/' + entry.name;
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out;
}

/* Resolve a reference found on `fromPage` to a path inside _site. */
function resolve(ref, fromPage) {
  let p = ref.split('#')[0].split('?')[0];
  if (p === '') return { file: fromPage, hash: ref.split('#')[1] };
  if (!p.startsWith('/')) p = path.posix.join(path.posix.dirname(fromPage), p);
  if (p.endsWith('/')) p += 'index.html';
  return { file: p, hash: ref.split('#')[1] };
}

/* Every asset URL a document points at. Shared by both consumers so the
   crawl and the prune agree byte for byte. */
function assetRefsIn(html) {
  const refs = [];
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/<img[^>]+srcset="([^"]+)"/g))
    m[1].split(',').forEach(c => refs.push(c.trim().split(/\s+/)[0]));
  for (const m of html.matchAll(/<source[^>]+srcset="([^"]+)"/g))
    m[1].split(',').forEach(c => refs.push(c.trim().split(/\s+/)[0]));
  for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/<link[^>]+href="([^"]+)"[^>]*rel="(?:stylesheet|icon|apple-touch-icon|preload)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/rel="(?:stylesheet|icon|apple-touch-icon|preload)"[^>]*href="([^"]+)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/<iframe[^>]+src="([^"]+)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)) refs.push(m[1]);
  return refs;
}

const EXTERNAL = /^(https?:|data:|mailto:|tel:|javascript:)/i;

/* The set of files inside _site that something actually points at.
   Walks HTML first, then follows any stylesheet it found, so fonts
   referenced only from @font-face are included. */
function referencedFiles(SITE) {
  const files = new Set(walk(SITE));
  const html = [...files].filter(f => f.endsWith('.html'));
  const referenced = new Set();

  const add = (ref, from) => {
    if (EXTERNAL.test(ref)) return;
    const { file } = resolve(ref, from);
    if (files.has(file)) referenced.add(file);
  };

  for (const page of html) {
    const body = fs.readFileSync(path.join(SITE, page), 'utf8');
    for (const ref of assetRefsIn(body)) add(ref, page);
    // internal page links keep pages reachable in the set too
    for (const m of body.matchAll(/href="([^"]+)"/g)) add(m[1], page);
  }

  // Follow stylesheets: @font-face and background-image live here.
  for (const css of [...referenced].filter(f => f.endsWith('.css'))) {
    const body = fs.readFileSync(path.join(SITE, css), 'utf8');
    for (const m of body.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)) add(m[1], css);
  }

  return { files, html, referenced };
}

module.exports = { walk, resolve, assetRefsIn, referencedFiles, EXTERNAL };
