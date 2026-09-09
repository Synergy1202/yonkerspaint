/* One-shot, already run. Lifted the department detail content out of the
   original hand-written pages into src/_data/deptdetail/*.json, verbatim.
   Image keys were layered on from IMAGE-MANIFEST.md coverage.

   Kept as the record of how the port was done. It will NOT run as-is any
   more: the source pages it reads (paint.html, plumbing.html, ...) were
   removed from the repo root in Package 4. To re-run it, restore them first:
     git checkout 5cf6d24 -- paint.html plumbing.html electrical.html        tools.html fasteners.html garden.html cleaning.html roofing.html */
const fs = require('fs');

const IMAGES = {
  paint:      { interior:'dept-paint-advance-cans-01.webp', exterior:'dept-paint-aura-shelf-01.webp',
                primers:'dept-paint-primer-shelf-01.webp',  stain:'dept-paint-stain-display-01.webp',
                sundries:'dept-paint-spray-01.webp',        match:'dept-paint-color-wall-03.webp' },
  plumbing:   { pipe:'dept-plumbing-cements-01.webp',       drain:'dept-plumbing-traps-01.webp' },
  electrical: {},
  tools:      { power:'dept-tools-dewalt-display-01.webp',  blades:'dept-tools-accessories-01.webp' },
  fasteners:  { screws:'dept-fasteners-bins-01.webp',       bolts:'dept-fasteners-wall-01.webp',
                anchors:'dept-fasteners-pegboard-01.webp',  hardware:'dept-fasteners-pegboard-02.webp',
                special:'dept-fasteners-aisle-01.webp',     keys:'service-key-cutting-01.webp' },
  garden:     {},
  cleaning:   { mops:'dept-cleaning-brooms-01.webp',        chem:'dept-cleaning-aisle-01.webp',
                disp:'dept-cleaning-aisle-02.webp' },
  roofing:    { roofcmt:'dept-roofing-cement-01.webp',      leak:'dept-roofing-coatings-01.webp' }
};

const dec = s => s.replace(/\s+/g, ' ').trim();

for (const slug of Object.keys(IMAGES)) {
  const s = fs.readFileSync(slug + '.html', 'utf8');
  const h1 = dec((s.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '');
  const sidebar = [...s.matchAll(/<li><a href="#([^"]+)">([^<]+)<\/a><\/li>/g)]
    .map(m => ({ id: m[1], label: dec(m[2]) }));
  const sections = [...s.matchAll(/<section id="([^"]+)" class="dept-section"[^>]*>([\s\S]*?)<\/section>/g)]
    .map(([, id, body]) => {
      const heading = dec((body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || '');
      const intro = dec((body.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '');
      const bullets = [...body.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => dec(m[1]));
      const sec = { id, heading, intro, bullets };
      if (IMAGES[slug][id]) sec.image = IMAGES[slug][id];
      // callout, if this section carries one
      const co = body.match(/<div class="callout">([\s\S]*?)<\/div>/);
      if (co) {
        const heading2 = dec((co[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || '');
        let text = dec((co[1].match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '');
        // Strip the hard-coded phone anchor; the template re-inserts it from site.json.
        text = text.replace(/<a href="tel:[^"]*"[^>]*>[^<]*<\/a>/g, '{{PHONE}}');
        const link = co[1].match(/<a class="btn" href="([^"]+)">([\s\S]*?)<\/a>/);
        sec.callout = { heading: heading2, text,
                        linkUrl: link ? '/' + link[1] : '/departments.html',
                        linkLabel: link ? dec(link[2]) : 'Back to Departments' };
      }
      return sec;
    });
  fs.writeFileSync('src/_data/deptdetail/' + slug + '.json',
    JSON.stringify({ h1, sidebar, sections }, null, 1) + '\n');
  console.log(slug.padEnd(11), sections.length + ' sections,',
    sections.filter(x => x.image).length + ' with images,',
    sections.filter(x => x.callout).length + ' callout');
}
