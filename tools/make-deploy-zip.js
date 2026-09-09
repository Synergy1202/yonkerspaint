/* Packages _site/ for upload to Hostinger.

   Zips the CONTENTS of _site/, not the folder, so extracting into
   public_html lands every file at the web root. Dotfiles are included:
   .htaccess is the whole reason the redirects and headers work, and it is
   the file most likely to be silently dropped by a GUI zip tool.

   Run: npm run deploy:zip   (build and check:all first) */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const OUT = path.join(ROOT, 'deploy');

if (!fs.existsSync(SITE)) {
  console.error('_site/ not found. Run `npm run build` first.');
  process.exit(1);
}
if (!fs.existsSync(path.join(SITE, '.htaccess'))) {
  console.error('_site/.htaccess is missing. Refusing to package a build without it.');
  process.exit(1);
}

/* Re-run the build integrity check immediately before packaging. This is not
   belt-and-braces: _site/ sits inside a OneDrive-synced folder, and files the
   build pruned have been observed reappearing afterwards. Whatever the cause,
   the archive must never be built from an unverified directory. */
try {
  execFileSync('node', [path.join(__dirname, 'check-dist.js')], { stdio: 'pipe' });
} catch (e) {
  console.error(String(e.stdout || ''));
  console.error('Build integrity check FAILED. Rebuild, then package again.');
  console.error('If files the build pruned have reappeared, run `npm run build` again');
  console.error('and package immediately afterwards.');
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const d = new Date();
const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const zipPath = path.join(OUT, `yonkers-site-${stamp}.zip`);
fs.rmSync(zipPath, { force: true });

/* Python's zipfile is used rather than a shell zip binary: Git Bash on
   Windows has no `zip`, and PowerShell's Compress-Archive is inconsistent
   about dotfiles. This gives exact control over the archive paths. */
const script = `
import os, zipfile, sys
site, out = sys.argv[1], sys.argv[2]
files = []
for root, dirs, names in os.walk(site):
    for n in names:
        full = os.path.join(root, n)
        rel = os.path.relpath(full, site).replace(os.sep, '/')
        files.append((full, rel))
files.sort(key=lambda x: x[1])
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for full, rel in files:
        z.write(full, rel)
print(len(files))
`;
const count = Number(execFileSync('python', ['-c', script, SITE, zipPath], { encoding: 'utf8' }).trim());
const bytes = fs.statSync(zipPath).size;

/* verify the archive before anyone uploads it */
const verify = `
import zipfile, sys
z = zipfile.ZipFile(sys.argv[1])
names = z.namelist()
bad = z.testzip()
print('BAD' if bad else 'OK')
print('yes' if '.htaccess' in names else 'no')
print('yes' if any(n.startswith('_site/') for n in names) else 'no')
`;
const [integrity, hasHtaccess, nested] =
  execFileSync('python', ['-c', verify, zipPath], { encoding: 'utf8' })
    .split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean);

console.log(`wrote deploy/${path.basename(zipPath)}`);
console.log(`  files:            ${count}`);
console.log(`  size:             ${(bytes / 1048576).toFixed(2)} MB`);
console.log(`  archive integrity: ${integrity}`);
console.log(`  .htaccess inside:  ${hasHtaccess}`);
console.log(`  nested _site/:     ${nested} (must be "no" so files land at the web root)`);

if (integrity !== 'OK' || hasHtaccess !== 'yes' || nested !== 'no') {
  console.error('\nArchive failed verification. Do not upload it.');
  process.exit(1);
}
console.log('\nUpload this to public_html and extract it there. See DEPLOY.md.');
