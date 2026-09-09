const fs=require('fs'),path=require('path');
const {walk}=require('./refs.js');
let bad=0,n=0;
for(const f of walk(path.join(__dirname,'..','_site')).filter(x=>x.endsWith('.html')).map(x=>x.slice(1))){
  const html=fs.readFileSync(path.join('_site',f),'utf8');
  const m=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if(!m){console.log('NO JSON-LD:',f);bad++;continue}
  try{ const j=JSON.parse(m[1]); n++;
    const types=j['@graph'].map(x=>x['@type']).join('+');
    console.log(f.padEnd(20),types);
  }catch(e){console.log('INVALID JSON-LD:',f,e.message);bad++}
}
console.log(bad?('\n'+bad+' FAILED'):'\nall '+n+' JSON-LD blocks parse');
