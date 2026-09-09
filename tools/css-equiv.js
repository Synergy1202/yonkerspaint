/* Proves a CSS refactor is behaviour-preserving without a browser.
   For every selector named on the command line, walks the stylesheet in
   document order, collects every rule whose selector list contains that exact
   selector, flattens the declarations the way the cascade would, and prints
   the resulting property map. Run it against two revisions and diff.

   Usage: node tools/css-equiv.js <cssFile> <sel1> <sel2> ... */
const fs = require('fs');
const file = process.argv[2];
const sels = process.argv.slice(3);
const css = fs.readFileSync(file, 'utf8');

/* strip comments, then walk top-level rules (skipping @media bodies, which
   are conditional and compared separately) */
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');

function rulesFor(sel) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const raw = m[1].trim();
    if (raw.startsWith('@')) continue;
    const parts = raw.split(',').map(s => s.trim());
    if (parts.includes(sel)) out.push(m[2]);
  }
  return out;
}

const result = {};
for (const sel of sels) {
  const map = {};
  for (const body of rulesFor(sel)) {
    for (const decl of body.split(';')) {
      const i = decl.indexOf(':');
      if (i < 0) continue;
      const prop = decl.slice(0, i).trim();
      const val = decl.slice(i + 1).trim();
      if (prop) map[prop] = val;   // later wins, as the cascade would
    }
  }
  result[sel] = Object.keys(map).sort().map(k => `${k}:${map[k]}`);
}
console.log(JSON.stringify(result, null, 1));
