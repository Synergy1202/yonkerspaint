/* Generates display-sized derivatives of the web assets in images/.
   The 1600px files stay the canonical set; these are what small boxes
   actually load. Alt text and provenance still come from IMAGE-MANIFEST.md
   via imagemeta.json — this only adds sizes, and never touches dropbox/.

   card/  480w  — homepage department grid (~176px box, 2x)
   wide/  800w  — departments overview panels, detail-page sections

   Run: node tools/build-derivatives.js   (then tools/build-imagemeta.js) */
const fs=require('fs'),path=require('path');
const sharp=require(path.join(__dirname,'..','triage','node_modules','sharp'));
const SRC=path.join(__dirname,'..','images');
const SETS=[{dir:'card',width:480,quality:76},{dir:'wide',width:800,quality:78}];

/* Only the keys actually rendered at each size, worked out from the same
   data the templates use. Keeps the deploy free of unused derivatives. */
function neededKeys(){
  const D=path.join(__dirname,'..','src','_data');
  const depts=JSON.parse(fs.readFileSync(path.join(D,'departments.json'),'utf8'));
  const card=new Set(), wide=new Set();
  for(const d of depts) if(d.images.length){ card.add(d.images[0]); wide.add(d.images[0]); }
  for(const f of fs.readdirSync(path.join(D,'deptdetail'))){
    const detail=JSON.parse(fs.readFileSync(path.join(D,'deptdetail',f),'utf8'));
    for(const sec of detail.sections) if(sec.image) wide.add(sec.image);
  }

  // services page: one figure per service, card size
  const svc=JSON.parse(fs.readFileSync(path.join(D,'services.json'),'utf8'));
  for(const s of svc) if(s.image) card.add(s.image);

  // named editorial placements in templates
  wide.add('staff-portrait-storefront-01.webp'); // about page lead figure
  wide.add('service-counter-portrait-01.webp');  // services page lead figure

  // guide hero + inline images (declared in src/guides/*.njk front matter/body)
  for (const k of ['dept-paint-color-wall-03.webp','dept-paint-regal-cans-01.webp',
                   'dept-fasteners-bins-01.webp','dept-fasteners-wall-01.webp',
                   'dept-paint-primer-shelf-01.webp','dept-paint-spray-01.webp',
                   'service-key-blanks-01.webp','service-key-cutting-01.webp']) wide.add(k);

  // editorial placements listed in src/_data/placements.json
  const pl=path.join(D,'placements.json');
  if(fs.existsSync(pl)){
    const P=JSON.parse(fs.readFileSync(pl,'utf8'));
    for(const group of Object.values(P))
      for(const item of group){
        if(item.variant==='card') card.add(item.image);
        if(item.variant==='wide') wide.add(item.image);
      }
  }
  return {card:[...card], wide:[...wide]};
}

(async()=>{
  const need=neededKeys();
  const out={};
  for(const set of SETS){
    const dest=path.join(SRC,set.dir);
    fs.rmSync(dest,{recursive:true,force:true});
    fs.mkdirSync(dest,{recursive:true});
    const files=need[set.dir];
    let total=0;
    for(const f of files){
      const info=await sharp(path.join(SRC,f))
        .resize({width:set.width,withoutEnlargement:true})
        .webp({quality:set.quality})
        .toFile(path.join(dest,f));
      total+=fs.statSync(path.join(dest,f)).size;
      out[set.dir+'/'+f]={width:info.width,height:info.height};
    }
    console.log(`${set.dir}/  ${files.length} files, ${(total/1024).toFixed(0)} KB total, avg ${(total/files.length/1024).toFixed(0)} KB`);
  }
  fs.writeFileSync(path.join(__dirname,'..','src','_data','derivatives.json'),
    JSON.stringify(out,null,1)+'\n');
  console.log('wrote src/_data/derivatives.json');
})();
