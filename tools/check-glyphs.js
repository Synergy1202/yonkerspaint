/* Guards the decision to replace UI font-glyphs with inline SVG.
   Those code points sit outside the self-hosted latin subset, so any that
   creep back into the markup would render in an arbitrary fallback face.
   Emoji are deliberately allowed: system emoji fallback is expected. */
const fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '_site');
const BANNED = {
  '\u2605': 'filled star (use the stars() macro)',
  '\u2606': 'empty star (use the stars() macro)',
  '\u25BE': 'dropdown caret (use the caret() macro)',
  '\u2630': 'hamburger (use the menu() macro)',
  '\u2713': 'check mark (use an SVG icon)',
  '\u2192': 'arrow (use an SVG icon)'
};
let found = 0;
for (const f of fs.readdirSync(SITE).filter(x => x.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(SITE, f), 'utf8');
  for (const [g, why] of Object.entries(BANNED)) {
    if (html.includes(g)) { console.log(`  ${f}: ${JSON.stringify(g)} — ${why}`); found++; }
  }
}
console.log(found === 0
  ? 'PASS: no UI font-glyphs in the markup (emoji excluded by design).'
  : `FAIL: ${found} glyph occurrence(s).`);
process.exit(found === 0 ? 0 : 1);
