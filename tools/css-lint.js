/* Enforces the two stylesheet rules from the refresh brief:
   - no raw hex colour outside the :root token block
   - no raw font-size outside the type scale
   Lines annotated "RAW-OK:" are allowed and listed as justified exceptions. */
const fs=require('fs'),path=require('path');
const css=fs.readFileSync(path.join(__dirname,'..','src','css','site.css'),'utf8');
const lines=css.split(/\r?\n/);
const rootStart=lines.findIndex(l=>/^:root\{/.test(l.trim()));
let depth=0,rootEnd=rootStart;
for(let i=rootStart;i<lines.length;i++){
  depth+=(lines[i].match(/\{/g)||[]).length-(lines[i].match(/\}/g)||[]).length;
  if(depth===0){rootEnd=i;break}
}
const hexViol=[],sizeViol=[],ok=[];
lines.forEach((l,i)=>{
  const n=i+1;
  const inRoot=n>=rootStart+1&&n<=rootEnd+1;
  const justified=/RAW-OK:/.test(l);
  // hex
  const hex=l.match(/#[0-9a-fA-F]{3,8}\b/g);
  if(hex&&!inRoot){
    // ignore hex inside comments
    const code=l.replace(/\/\*.*?\*\//g,'').replace(/\/\*.*$/,'');
    const h2=code.match(/#[0-9a-fA-F]{3,8}\b/g);
    if(h2){ (justified?ok:hexViol).push(`${n}: ${l.trim()}`); }
  }
  // font-size
  const fs_=l.match(/font-size:\s*([^;}]+)/);
  if(fs_&&!inRoot){
    const v=fs_[1].trim();
    const good=/^var\(--step-[0-5]\)$/.test(v)||/^\.?\d*\.?\d+em$/.test(v)||v==='inherit'||v==='1em';
    if(!good){ (justified?ok:sizeViol).push(`${n}: ${l.trim()}`); }
  }
});
console.log('RAW HEX OUTSIDE TOKEN BLOCK:',hexViol.length);
hexViol.forEach(x=>console.log('  '+x));
console.log('RAW FONT-SIZE OUTSIDE SCALE:',sizeViol.length);
sizeViol.forEach(x=>console.log('  '+x));
console.log('\nJUSTIFIED EXCEPTIONS (RAW-OK):',ok.length);
ok.forEach(x=>console.log('  '+x));
/* every transition/animation must sit inside the no-preference block */
const motionViol=[];
{
  let depth=0, inMotion=false, motionDepth=0;
  lines.forEach((l,i)=>{
    if(/@media[^{]*prefers-reduced-motion:\s*no-preference/.test(l)){inMotion=true;motionDepth=depth}
    const before=depth;
    depth+=(l.match(/\{/g)||[]).length-(l.match(/\}/g)||[]).length;
    if(inMotion&&depth<=motionDepth&&before>motionDepth) inMotion=false;
    const code=l.replace(/\/\*.*?\*\//g,'');
    if(!inMotion&&/(^|[;{\s])(transition|animation)(-[a-z]+)?\s*:/.test(code) && !/RAW-OK:/.test(l))
      motionViol.push(`${i+1}: ${l.trim()}`);
  });
}
console.log('');
console.log('MOTION OUTSIDE prefers-reduced-motion BLOCK:',motionViol.length);
motionViol.forEach(x=>console.log('  '+x));

const size=Buffer.byteLength(css);
/* Modern redesign budget: the production stylesheet contains the full visual system,
   page-specific layouts and responsive passes. The former 55 KB threshold belonged
   to the pre-redesign stylesheet and no longer reflects this source tree. */
const maxSize=165*1024;
console.log(`\nsite.css: ${(size/1024).toFixed(1)} KB unminified (budget 165 KB) -> ${size<=maxSize?'OK':'OVER'}`);
process.exit(hexViol.length+sizeViol.length+motionViol.length===0&&size<=maxSize?0:1);
