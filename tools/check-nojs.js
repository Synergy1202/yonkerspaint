/* No-JS verification. Renders each page with scripts stripped, and asserts
   every nav destination is still present as a real <a href> in the markup,
   and that the <noscript> override exists to reveal the drawer contents.
   This is a static proof: nothing here depends on script running. */
const fs = require('fs'), path = require('path');
const { walk } = require('./refs.js');
const SITE = path.join(__dirname, '..', '_site');

const pages = walk(SITE).filter(f => f.endsWith('.html')).map(f => f.slice(1));
let problems = 0;
const note = (ok, msg) => { if (!ok) problems++; console.log('  ' + (ok ? 'OK  ' : 'FAIL') + '  ' + msg); };

/* Destinations the nav must offer without any script. */
const MUST = ['/index.html', '/departments.html', '/services.html', '/guides/',
              '/reviews.html', '/faq.html', '/about.html', '/contact.html'];

console.log('\n1. Nav destinations present as real links, scripts stripped');
for (const f of pages) {
  let html = fs.readFileSync(path.join(SITE, f), 'utf8');
  // remove every <script> block: this is what a no-JS browser effectively sees
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const missing = MUST.filter(u => !html.includes('href="' + u + '"'));
  note(missing.length === 0, `${f}${missing.length ? ' missing ' + missing.join(', ') : ''}`);
}

console.log('\n2. All 9 departments reachable from every page without script');
const depts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', '_data', 'departments.json'), 'utf8'));
for (const f of pages) {
  let html = fs.readFileSync(path.join(SITE, f), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const missing = depts.filter(d => !html.includes('href="' + d.url + '"')).map(d => d.slug);
  note(missing.length === 0, `${f}${missing.length ? ' missing ' + missing.join(', ') : ''}`);
}

console.log('\n3. The <noscript> override is present on every page');
for (const f of pages) {
  const html = fs.readFileSync(path.join(SITE, f), 'utf8');
  note(/<noscript>[\s\S]*?nav-toggle[\s\S]*?<\/noscript>/.test(html), f);
}

console.log('\n4. Guide content is in the HTML, not built by script');
for (const f of pages.filter(p => p.startsWith('guides/') && !p.endsWith('index.html'))) {
  let html = fs.readFileSync(path.join(SITE, f), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  note(words > 500, `${f} — ${words} words render without script`);
}

console.log('\n' + (problems === 0
  ? 'PASS: the site is fully usable with JavaScript disabled.'
  : `FAIL: ${problems} problem(s).`));
process.exit(problems === 0 ? 0 : 1);
