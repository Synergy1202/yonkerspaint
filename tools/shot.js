/* Full-page screenshots via Lighthouse's own capture, for before/after
   visual diffing of a pure-CSS refactor. Usage: node tools/shot.js <dir> <port> */
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2], PORT = process.argv[3] || '8096';
const PAGES = ['index','departments','services','paint','reviews','guides/wall-anchors'];
fs.mkdirSync(OUT,{recursive:true});
for (const p of PAGES) {
  const j = path.join(OUT, p.replace(/\//g,'-') + '.json');
  execFileSync('npx',['-y','lighthouse',`http://localhost:${PORT}/${p}.html`,'--quiet',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    '--only-categories=performance','--output=json','--output-path='+j,'--preset=desktop'],
    {stdio:['ignore','ignore','ignore'],shell:true,timeout:180000});
  const r = JSON.parse(fs.readFileSync(j,'utf8'));
  const fp = r.fullPageScreenshot && r.fullPageScreenshot.screenshot;
  if (fp) {
    fs.writeFileSync(path.join(OUT, p.replace(/\//g,'-')+'.jpg'),
      Buffer.from(fp.data.replace(/^data:image\/[a-z]+;base64,/,''),'base64'));
    console.log('shot', p, fp.width+'x'+fp.height);
  }
  fs.rmSync(j);
}
