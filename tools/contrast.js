/* Contrast checker for the palette. Reads the token block out of site.css so
   the table can never drift from the stylesheet. Run: node tools/contrast.js */
const fs=require('fs'),path=require('path');
function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)}
function L(hex){hex=hex.replace('#','');if(hex.length===3)hex=[...hex].map(x=>x+x).join('');
  const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
  return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)}
function cr(a,b){const la=L(a),lb=L(b);return ((Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05))}
module.exports={cr};
if(require.main===module){
  const css=fs.readFileSync(path.join(__dirname,'..','src','css','site.css'),'utf8');
  const tok={};
  for(const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) tok['--'+m[1]]=m[2];
  const v=k=>tok[k]||k;
  const PAIRS=JSON.parse(fs.readFileSync(path.join(__dirname,'contrast-pairs.json'),'utf8'));
  let fail=0;
  const rows=PAIRS.map(p=>{
    const fg=v(p.fg),bg=v(p.bg),r=cr(fg,bg);
    const need=p.large?3:4.5;
    const ok=r>=need;
    if(!ok)fail++;
    return {...p,fg,bg,r,need,ok};
  });
  const w=(s,n)=>String(s).padEnd(n);
  console.log(w('use',44)+w('foreground',22)+w('background',22)+w('ratio',8)+w('needs',7)+'verdict');
  console.log('-'.repeat(112));
  for(const r of rows){
    console.log(w(r.use,44)+w(r.fg+' '+r.fgTok,22)+w(r.bg+' '+r.bgTok,22)+
      w(r.r.toFixed(2)+':1',8)+w(r.need+':1',7)+(r.ok?'PASS':'*** FAIL ***'));
  }
  console.log('-'.repeat(112));
  console.log(fail===0?`all ${rows.length} pairs pass`:`${fail} of ${rows.length} FAIL`);
  process.exit(fail?1:0);
}
