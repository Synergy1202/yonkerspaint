/* Derives src/_data/imagemeta.json from IMAGE-MANIFEST.md (alt text, the
   source of truth) plus real file dimensions. Does not modify the manifest. */
const fs = require('fs');
const path = require('path');
const sharp = require(path.join(__dirname, '..', 'triage', 'node_modules', 'sharp'));

const md = fs.readFileSync('IMAGE-MANIFEST.md', 'utf8');
const rowRe = /^\| `([a-z0-9-]+\.webp)` \| (DSC\d+\.jpg) \| (.*?) \| (.*?) \| (\d+)×(\d+) \| (.*?) \| (.*?) \|$/gm;

(async () => {
  const out = {};
  let m, n = 0;
  while ((m = rowRe.exec(md)) !== null) {
    const [, file, src, subject, depts, , , use, alt] = m;
    const p = path.join('images', file);
    if (!fs.existsSync(p)) { console.error('MISSING FILE', file); continue; }
    const meta = await sharp(p).metadata();
    out[file] = {
      src, width: meta.width, height: meta.height,
      alt: alt.trim(),
      subject: subject.trim(),
      departments: depts.trim(),
      use: use.trim()
    };
    n++;
  }
  fs.writeFileSync('src/_data/imagemeta.json', JSON.stringify(out, null, 1) + '\n');
  console.log('wrote src/_data/imagemeta.json with', n, 'entries');
  const onDisk = fs.readdirSync('images').filter(f => f.endsWith('.webp'));
  const missing = onDisk.filter(f => !out[f]);
  if (missing.length) console.error('NOT IN MANIFEST:', missing.join(', '));
  else console.log('every images/*.webp has manifest metadata');
})();
