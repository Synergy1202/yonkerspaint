/* Generates the counter-card review kit: a QR code PNG and a print-ready
   4x6 card pointing at the store's Google review link.

   Reads site.reviewUrl. If it is empty, this exits without writing anything
   — a card with a placeholder URL on it is worse than no card.

   Usage: node tools/make-review-kit.js
   Output: review-kit/qr.png and review-kit/counter-card.html (gitignored) */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', '_data', 'site.json'), 'utf8'));
const url = (site.reviewUrl || '').trim();

if (!url) {
  console.error('\nNo review link set, so nothing was generated.\n');
  console.error('  Add the store\'s Google review short link to "reviewUrl" in');
  console.error('  src/_data/site.json, then run this again:\n');
  console.error('    "reviewUrl": "https://g.page/r/XXXXXXXXXXXX/review"\n');
  console.error('  Setting it also switches on the "Review us on Google" links');
  console.error('  on the reviews page and in the pre-footer band. While it is');
  console.error('  empty, the site renders neither.\n');
  process.exit(1);
}

const QRCode = require('qrcode');
const OUT = path.join(ROOT, 'review-kit');
fs.mkdirSync(OUT, { recursive: true });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

(async () => {
  const qrPath = path.join(OUT, 'qr.png');
  await QRCode.toFile(qrPath, url, {
    width: 1200,               // large enough to print crisply at 4x6
    margin: 2,
    errorCorrectionLevel: 'H', // survives a scuffed counter card
    color: { dark: '#15181cff', light: '#ffffffff' }
  });
  console.log('wrote review-kit/qr.png  (' + (fs.statSync(qrPath).size / 1024).toFixed(0) + ' KB)');

  /* 4x6 inches at 300dpi = 1200x1800px. Sized in inches so the browser's
     print dialog lays it out correctly on 4x6 photo stock. */
  const card = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Review card — ${esc(site.name)}</title>
<style>
  @page { size: 4in 6in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 4in; height: 6in; }
  body {
    font-family: "Barlow Condensed", "Arial Narrow", Arial, sans-serif;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    padding: 0.4in 0.35in;
    color: #1d2328;
    background: #ffffff;
  }
  .rule { width: 100%; height: 0.06in; background: #0054a6; margin-bottom: 0.3in; }
  h1 { font-size: 30pt; line-height: 1.05; font-weight: 600; text-transform: uppercase; color: #0054a6; }
  p.sub { font-family: "Source Sans 3", Arial, sans-serif; font-size: 13pt; line-height: 1.35; margin-top: 0.12in; color: #5c6670; }
  img { width: 2.5in; height: 2.5in; margin: 0.28in 0; }
  p.how { font-family: "Source Sans 3", Arial, sans-serif; font-size: 11pt; color: #5c6670; }
  footer { margin-top: auto; font-family: "Source Sans 3", Arial, sans-serif; font-size: 10pt; color: #5c6670; line-height: 1.4; }
  footer strong { display: block; font-size: 12pt; color: #1d2328; }
  @media screen { body { border: 1px solid #e0e5e9; margin: 20px auto; } }
</style>
</head>
<body>
  <div class="rule"></div>
  <h1>Happy with your visit?</h1>
  <p class="sub">Leave us a Google review</p>
  <img src="qr.png" alt="QR code linking to the Google review page for ${esc(site.name)}">
  <p class="how">Point your camera at the code</p>
  <footer>
    <strong>${esc(site.name)}</strong>
    ${esc(site.address.street)}, ${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postalCode)}<br>
    ${esc(site.phone.display)}
  </footer>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, 'counter-card.html'), card);
  console.log('wrote review-kit/counter-card.html');
  console.log('\nTo print: open counter-card.html in a browser, Print, choose 4x6 photo');
  console.log('paper, set margins to none, and turn off headers and footers.');
})();
