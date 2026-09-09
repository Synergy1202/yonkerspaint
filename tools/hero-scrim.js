/* Measures white-on-photo contrast in the hero, unscrimmed and scrimmed,
   to justify (or remove) the scrim. */
const path=require('path');
const sharp=require(path.join(__dirname,'..','triage','node_modules','sharp'));
const {cr}=require('./contrast.js');
const IMG=path.join(__dirname,'..','images','dept-paint-color-wall-01.webp');
const SCRIM_TOP=0.58, SCRIM_BOT=0.66, SCRIM_RGB=[11,14,17];
const hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
(async()=>{
  const img=sharp(IMG);
  const {width,height}=await img.metadata();
  const regions={
    'whole frame':          {left:0,top:0,width,height},
    'right third (text bed)':{left:Math.round(width*0.66),top:0,width:Math.round(width*0.34),height},
    'centre band (headline)':{left:Math.round(width*0.15),top:Math.round(height*0.30),
                              width:Math.round(width*0.70),height:Math.round(height*0.40)},
    'upper band':           {left:0,top:0,width,height:Math.round(height*0.33)},
    'lower band':           {left:0,top:Math.round(height*0.66),width,height:Math.round(height*0.34)}
  };
  console.log('region                     mean px   white-on-raw   +scrim -> effective   white-on-scrimmed');
  console.log('-'.repeat(100));
  for(const [name,r] of Object.entries(regions)){
    const st=await sharp(await sharp(IMG).extract(r).toBuffer()).stats();
    const [R,G,B]=st.channels.slice(0,3).map(c=>c.mean);
    const raw=hex(R,G,B);
    const a=(SCRIM_TOP+SCRIM_BOT)/2;
    const eff=hex(R*(1-a)+SCRIM_RGB[0]*a, G*(1-a)+SCRIM_RGB[1]*a, B*(1-a)+SCRIM_RGB[2]*a);
    console.log(name.padEnd(26),raw.padEnd(10),
      (cr('#ffffff',raw).toFixed(2)+':1').padEnd(15),
      (eff+' ').padEnd(22),
      cr('#ffffff',eff).toFixed(2)+':1');
  }
  // worst case: brightest single 32x32 tile anywhere in the frame
  let worst={l:0,cr:99,hex:''};
  const step=Math.floor(Math.min(width,height)/12);
  for(let y=0;y+step<=height;y+=step){
    for(let x=0;x+step<=width;x+=step){
      const st=await sharp(await sharp(IMG).extract({left:x,top:y,width:step,height:step}).toBuffer()).stats();
      const [R,G,B]=st.channels.slice(0,3).map(c=>c.mean);
      const a=(SCRIM_TOP+SCRIM_BOT)/2;
      const eff=hex(R*(1-a)+SCRIM_RGB[0]*a,G*(1-a)+SCRIM_RGB[1]*a,B*(1-a)+SCRIM_RGB[2]*a);
      const c=cr('#ffffff',eff);
      if(c<worst.cr) worst={cr:c,hex:eff,raw:hex(R,G,B),x,y};
    }
  }
  console.log('-'.repeat(100));
  console.log(`WORST tile scrimmed: ${worst.hex} (raw ${worst.raw}) -> white contrast ${worst.cr.toFixed(2)}:1`);
  console.log(`Unscrimmed that tile would be ${cr('#ffffff',worst.raw).toFixed(2)}:1`);
})();
