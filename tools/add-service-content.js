/* One-shot: adds the what / when / bring detail to each service in
   src/_data/services.json. Store-specific lines trace to the bullets and
   notes already in that file; the rest is general education phrased so it
   never reads as a store promise. Logged in CONTENT-SOURCES.md. */
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'src', '_data', 'services.json');
const S = JSON.parse(fs.readFileSync(P, 'utf8'));

const ADD = {
  "key-duplication": {
    what: "Cutting a copy means finding a blank with the right profile for your lock, then grinding the depths from your original onto it. Most house, office and padlock keys are the everyday case and take a couple of minutes at the counter.",
    when: "When you want a spare before you need one, when a tenant or family member needs their own, or when a key has worn enough that it sticks &mdash; a copy cut from a worn key inherits the wear, so copy from the best original you have.",
    bring: "Bring the key itself rather than a photo or a number. If it is stamped &ldquo;do not duplicate&rdquo; or came from a restricted system, the blank may be controlled and we will tell you straight away. Transponder and laser-cut car keys need programming equipment beyond a key machine."
  },
  "paint-color-matching": {
    what: "A spectrophotometer reads your sample, measures how much of each wavelength it reflects, and turns that into a tint recipe for a paint base. It is measurement rather than judgement by eye, which is why a chip, a fabric swatch or a piece of siding can all be read.",
    when: "When you are patching a wall and cannot find the original can, when you want to carry a colour from one material to another, or when you are re-ordering and need the second gallon to match the first.",
    bring: "Bring a flat sample at least an inch square. Clean, matte and flat reads best &mdash; gloss, curves and dirt all skew the measurement. If you know the original brand and colour name, bring that too; a named formula beats a scan."
  },
  "repairs-assembly": {
    what: "Small bench work on the kind of thing that is not worth a service call: a wheelbarrow that needs a new wheel, a hand truck with a flat, a lawn tool with a broken handle, or a flat-pack item that has defeated its instructions.",
    when: "When the part is cheap but the job needs a vice, a press or a second pair of hands. It is worth asking before replacing something outright.",
    bring: "Bring the item and any parts that came off it, including the broken ones &mdash; matching a fitting is far easier with the original in hand."
  },
  "local-delivery": {
    what: "A drop-off for the loads that will not fit in a car: paint pails, sheet-rock, lumber and bulk bags. Curb-side or inside-threshold, so you can specify where it lands.",
    when: "When the material is heavy, long or awkward, when you are working from a job site rather than a driveway, or when you simply cannot make two trips.",
    bring: "Have the delivery address, a contact number and any access details ready &mdash; stairs, a narrow drive, gate codes, or where the truck can legally stop. Say up front if the load has to go inside rather than to the kerb."
  },
  "bulk-contractor": {
    what: "Pallet quantities and account terms for people buying regularly rather than occasionally, on the goods that move in volume: concrete mix, sheet goods and paint.",
    when: "When you are ordering repeatedly for a job, when the quantity is large enough that per-unit price matters, or when you need purchases tracked against a business account rather than paid ad hoc.",
    bring: "Bring your resale or tax-exempt certificate to open an account. For a price comparison, bring a recent invoice or a written quote rather than a screenshot without terms on it."
  }
};

let n = 0;
for (const s of S) {
  const a = ADD[s.id];
  if (!a) { console.error('no detail for', s.id); process.exit(1); }
  s.what = a.what; s.when = a.when; s.bring = a.bring;
  n++;
}
fs.writeFileSync(P, JSON.stringify(S, null, 1) + '\n');
console.log(n + ' services expanded with what / when / bring');
