/* Generates favicons + the OG fallback image into src/static/ and images/.
   Sources: images/yonkerslogo.png (the store logo) and the manifest hero. */
const fs = require('fs'), path = require('path');
const sharp = require(path.join(__dirname, '..', 'triage', 'node_modules', 'sharp'));

const STATIC = path.join(__dirname, '..', 'src', 'static');
fs.mkdirSync(STATIC, { recursive: true });

/* An .ico may simply wrap a PNG payload; every browser in use supports it. */
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);          // reserved
  header.writeUInt16LE(1, 2);          // type: icon
  header.writeUInt16LE(1, 4);          // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width  (0 means 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2);              // palette
  entry.writeUInt8(0, 3);              // reserved
  entry.writeUInt16LE(1, 4);           // colour planes
  entry.writeUInt16LE(32, 6);          // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);         // offset
  return Buffer.concat([header, entry, pngBuffer]);
}

(async () => {
  const logo = path.join(__dirname, '..', 'images', 'yonkerslogo.png');

  for (const size of [16, 32, 180]) {
    const name = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
    await sharp(logo)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: size === 180 ? 1 : 0 } })
      .png()
      .toFile(path.join(STATIC, name));
    console.log('wrote src/static/' + name);
  }

  const ico32 = await sharp(logo)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png().toBuffer();
  fs.writeFileSync(path.join(STATIC, 'favicon.ico'), pngToIco(ico32, 32));
  console.log('wrote src/static/favicon.ico');

  /* OG fallback: 1200x630 from the recommended hero. */
  await sharp(path.join(__dirname, '..', 'images', 'dept-paint-color-wall-01.webp'))
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82 })
    .toFile(path.join(__dirname, '..', 'images', 'og-default.jpg'));
  console.log('wrote images/og-default.jpg');
})();
