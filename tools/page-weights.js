/* Reports the transfer weight of each built page: the HTML plus every local
   asset it references (deduped). Shared assets are counted per page, which
   is what a first-time visitor actually downloads. */
const fs=require('fs'),path=require('path');
const {walk}=require('./refs.js');
const SITE=path.join(__dirname,'..','_site');
const size=f=>{try{return fs.statSync(path.join(SITE,f)).size}catch{return 0}};
const rows=[];
for(const f of walk(SITE).filter(x=>x.endsWith('.html')).map(x=>x.slice(1))){
  const html=fs.readFileSync(path.join(SITE,f),'utf8');
  const refs=new Set();
  const add=r=>{if(!/^(https?:|data:|mailto:|tel:|#)/i.test(r))refs.add(r.split('#')[0].split('?')[0])};
  for(const m of html.matchAll(/<img[^>]+src="([^"]+)"/g))add(m[1]);
  for(const m of html.matchAll(/<script[^>]+src="([^"]+)"/g))add(m[1]);
  for(const m of html.matchAll(/href="([^"]+)"[^>]*rel="(?:stylesheet|icon|apple-touch-icon)"/g))add(m[1]);
  for(const m of html.matchAll(/rel="(?:stylesheet|icon|apple-touch-icon)"[^>]*href="([^"]+)"/g))add(m[1]);
  for(const m of html.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g))add(m[1]);
  const cssFiles=[...refs].filter(r=>r.endsWith('.css'));
  for(const c of cssFiles){
    const css=fs.readFileSync(path.join(SITE,c),'utf8');
    for(const m of css.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g))add(m[1]);
  }
  const html_b=size('/'+f);
  const asset_b=[...refs].reduce((a,r)=>a+size(r),0);
  rows.push({page:f,html:html_b,assets:asset_b,total:html_b+asset_b,n:refs.size});
}
rows.sort((a,b)=>b.total-a.total);
const kb=b=>(b/1024).toFixed(0).padStart(6);
console.log('page                    HTML      assets      TOTAL   refs');
console.log('-'.repeat(60));
for(const r of rows) console.log(r.page.padEnd(20),kb(r.html),kb(r.assets),kb(r.total),String(r.n).padStart(5));
console.log('-'.repeat(60));
console.log('heaviest page:',(rows[0].total/1024).toFixed(0),'KB  |  lightest:',(rows[rows.length-1].total/1024).toFixed(0),'KB');
let all=0;for(const f of fs.readdirSync(SITE))if(fs.statSync(path.join(SITE,f)).isFile())all+=fs.statSync(path.join(SITE,f)).size;
console.log('_site total (incl. images/):',(require('child_process').execSync('du -sh _site',{cwd:path.join(__dirname,'..')}).toString().split('\t')[0]));
