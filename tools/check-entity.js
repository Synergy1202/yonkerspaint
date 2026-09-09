/* Entity consistency: the store's name, address and phone must read the same
   in visible page copy, in the JSON-LD graph, and in llms.txt, and must all
   trace back to src/_data/site.json. Also checks sameAs and hasMap.

   Run: node tools/check-entity.js   (after npm run build) */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', '_site');
const site = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', '_data', 'site.json'), 'utf8'));

const decode = s => String(s)
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, m =>
    String.fromCodePoint(Number(m.slice(2, -1))));

const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
let problems = 0;
const note = (ok, msg) => { if (!ok) problems++; console.log('  ' + (ok ? 'OK  ' : 'FAIL') + '  ' + msg); };

/* ---- 1. visible copy on every page ---------------------------------- */
console.log('\n1. Visible NAP on every page');
for (const f of pages) {
  const html = decode(fs.readFileSync(path.join(SITE, f), 'utf8'));
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const hasName = text.includes(site.name);
  const hasStreet = text.includes(site.address.street);
  const hasPhone = text.includes(site.phone.display);
  const hasTel = text.includes('tel:' + site.phone.tel);
  note(hasName && hasStreet && hasPhone && hasTel,
    `${f}: name ${hasName ? 'y' : 'n'}, street ${hasStreet ? 'y' : 'n'}, phone ${hasPhone ? 'y' : 'n'}, tel: ${hasTel ? 'y' : 'n'}`);
}

/* ---- 2. no conflicting variants anywhere ---------------------------- */
console.log('\n2. No stale NAP variants');
const BAD = [
  ['old red-flag phone', /914[.\s]963[.\s]3525/],
  ['alternate street', /\b65\s+Main\s+St\b(?!reet)/],
  ['old zip', /\b1070[02-9]\b/]
];
for (const [label, re] of BAD) {
  const hits = pages.filter(f => re.test(decode(fs.readFileSync(path.join(SITE, f), 'utf8'))));
  note(hits.length === 0, `${label}: ${hits.length ? hits.join(', ') : 'none'}`);
}

/* ---- 3. JSON-LD graph on every page --------------------------------- */
console.log('\n3. JSON-LD HardwareStore node');
for (const f of pages) {
  const html = fs.readFileSync(path.join(SITE, f), 'utf8');
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) { note(false, `${f}: no JSON-LD`); continue; }
  let store;
  try { store = JSON.parse(m[1])['@graph'].find(n => n['@type'] === 'HardwareStore'); }
  catch (e) { note(false, `${f}: JSON-LD will not parse`); continue; }
  if (!store) { note(false, `${f}: no HardwareStore node`); continue; }
  const ok =
    store.name === site.name &&
    store.telephone === site.phone.schema &&
    store.email === site.email &&
    store.address.streetAddress === site.address.street &&
    store.address.addressLocality === site.address.city &&
    store.address.addressRegion === site.address.region &&
    store.address.postalCode === site.address.postalCode &&
    Array.isArray(store.sameAs) && store.sameAs.includes(site.instagram.url) &&
    store.hasMap === site.map.link;
  note(ok, `${f}: name/phone/email/address/sameAs/hasMap match site.json`);
}

/* ---- 4. llms.txt ----------------------------------------------------- */
console.log('\n4. llms.txt');
const llms = fs.readFileSync(path.join(SITE, 'llms.txt'), 'utf8');
const fields = [
  ['name', site.name], ['street', site.address.street], ['city', site.address.city],
  ['region', site.address.region], ['postalCode', site.address.postalCode],
  ['phone display', site.phone.display], ['tel', site.phone.tel],
  ['email', site.email], ['instagram', site.instagram.url],
  ['hasMap', site.map.link], ['founded', site.foundingDate]
];
for (const [label, v] of fields) note(llms.includes(v), `llms.txt carries ${label}: ${v}`);
for (const h of site.hours) note(llms.includes(h.label) && llms.includes(h.display), `llms.txt hours ${h.label}`);

console.log('\n' + (problems === 0
  ? 'PASS: entity data is identical across visible copy, JSON-LD and llms.txt.'
  : `FAIL: ${problems} inconsistency(ies).`));
process.exit(problems === 0 ? 0 : 1);
