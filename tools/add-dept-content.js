/* One-shot: adds the answer-first intro and the FAQ set to each
   src/_data/deptdetail/*.json. Kept in the repo as the record of what was
   added and where each store-specific claim came from.

   GROUNDING: every store-specific sentence below traces to copy already in
   this repo (cited in CONTENT-SOURCES.md). Everything else is general
   education, written so it never reads as a store promise. */
const fs = require('fs');
const path = require('path');
const D = path.join(__dirname, '..', 'src', '_data', 'deptdetail');

const CONTENT = {
  paint: {
    intro: "Our paint department carries Benjamin Moore interior and exterior paint, primers, stains and clear finishes, along with the brushes, rollers, tape, sandpaper and caulk that go with them &mdash; and we mix colour at the counter while you wait. Interior and exterior paints are built for different problems: interior formulas are tuned for scrub resistance and low odour in a closed room, while exterior formulas trade some hardness for flexibility so the film can expand and contract through a Northeast winter without cracking. Primer does the half of the job nobody sees. It blocks stains bleeding through, gives glossy or chalky surfaces something to grip, and evens out how much the wall drinks, so the topcoat covers in fewer passes. If you are matching a colour you already have, bring a flat sample at least an inch square.",
    faqs: [
      { q: "How does paint colour matching actually work?",
        a: "A spectrophotometer shines light on your sample and measures how much of each wavelength bounces back. That reading becomes a set of coordinates, and software works out which colourants, and how much of each, will land a tint base on the same spot. It is arithmetic, not eyeballing, which is why a chip, a pillow or a piece of siding can all be read. We scan on a Benjamin Moore spectrophotometer and keep the formula on file so a re-order matches the first batch." },
      { q: "How big does my sample need to be?",
        a: "A flat sample at least one inch square &mdash; larger than a quarter &mdash; gives the most accurate reading. Bigger and flatter is better: the instrument averages across the area it sees, so a curved, glossy or dirty surface can skew the result. A clean, matte, flat piece reads best." },
      { q: "Do I really need to prime?",
        a: "It depends on what is underneath. Bare drywall, bare wood, masonry and anything patched will drink topcoat unevenly without a primer. Glossy surfaces need a bonding primer so the new film has something to hold onto. Water stains, smoke and tannin-rich woods need a stain-blocking primer or they will bleed through, sometimes weeks later. Repainting a sound, similar-coloured wall in the same sheen is the usual case where you can skip it." }
    ]
  },

  plumbing: {
    intro: "The plumbing counter covers pipe and fittings in black iron, galvanized, copper, PEX, CPVC and PVC, brass valves and supply lines, drain and DWV parts, sump and utility pumps, and the tape, dope and washers that finish a repair. We also cut and thread black iron or galvanized pipe up to 2&Prime; NPT while you wait. Most household repairs come down to knowing two things: what the pipe is made of, and what size it actually is. Pipe is sold by nominal size, not by the number you get off a tape measure, so a &frac12;&Prime; copper line measures about 5&frasl;8&Prime; across the outside. Bring the old part if you can &mdash; a failed fitting in hand settles the question faster than any measurement.",
    faqs: [
      { q: "Push-to-connect or soldered copper?",
        a: "Push-to-connect fittings grip the pipe with a stainless ring and seal with an O-ring, so they go together with no flame, no flux and no drying time, and they come apart with a release tool. Soldering costs less per joint and takes up less room, which matters in a tight bay, but it needs a torch, a dry line and some practice. For a repair under time pressure, push-to-connect is the forgiving option; for a long run being built from scratch, the cost difference adds up." },
      { q: "What does pipe threading get me?",
        a: "Threaded pipe lets you build a run to an exact length instead of working around the fixed sizes on the shelf. We cut and thread black iron or galvanized pipe up to 2&Prime; NPT while you wait, and ream the cut end so the inside diameter is not choked down. Bring your measurement, or the piece you are replacing." },
      { q: "Why does my new fitting leak at the threads?",
        a: "Tapered pipe threads seal by wedging metal against metal, so they need a thread sealant to fill the spiral gap: PTFE tape wound in the direction of tightening, or pipe dope, or both. Over-tightening does not fix a leak &mdash; past a certain point it stretches the female fitting and makes it worse. Compression and flare fittings work differently and generally want no sealant on the sealing surface at all." }
    ]
  },

  electrical: {
    intro: "Our electrical aisle stocks NM-B and THHN wire, switches, outlets, GFCIs and wallplates, LED bulbs and fixtures, extension cords and surge protection, timers and thermostats, plus connectors, boxes, conduit and batteries. A good rule before starting anything: electrical work is governed by code, and in New York some of it must be done or inspected by a licensed electrician. Swapping a like-for-like fixture or a switch is ordinary homeowner territory; new circuits, panel work and anything you are unsure about are not. The two numbers worth knowing are the breaker rating on the circuit and the gauge of the wire feeding it, because those two have to agree. If you bring the old device with you, matching it is straightforward.",
    faqs: [
      { q: "What gauge wire goes with what breaker?",
        a: "In ordinary residential branch circuits, 14 AWG copper pairs with a 15-amp breaker and 12 AWG with a 20-amp breaker; heavier loads step up from there. The wire has to be sized for the breaker, never the other way round, because the breaker is what protects the wire from overheating. Local code, cable type, length of run and how the cable is bundled all affect the answer, so confirm anything unusual with an electrician or your inspector." },
      { q: "What makes a GFCI different from a normal outlet?",
        a: "A GFCI compares the current going out on the hot with the current coming back on the neutral. If the two stop matching, the difference is leaking somewhere it should not be &mdash; possibly through a person &mdash; and the device cuts power in a fraction of a second. That is why they are required near water. It is not the same thing as a circuit breaker, which protects the wiring from overload rather than protecting you from a shock." },
      { q: "How do I pick an LED bulb to replace an old one?",
        a: "Match on lumens, not watts. Lumens measure light output; watts only measure power draw, and LEDs draw far less for the same light. As a rough guide, an old 60-watt incandescent is around 800 lumens. Then choose colour temperature: about 2700K is the warm, yellowish light people associate with incandescent bulbs, while 4000K and up reads cool and blue-white. Check the fixture too &mdash; enclosed and dimmed fixtures need bulbs rated for it." }
    ]
  },

  tools: {
    intro: "The tool wall runs from cordless drills, impact drivers and saws through hand tools, blades and bits, measuring and layout gear, safety equipment and jobsite storage. If you are choosing a cordless platform, the batteries matter more than the first tool: every manufacturer uses its own battery mount, so the system you buy into is the one you stay in. Buying a bare tool once you own batteries is usually far cheaper than another kit. For anything that cuts, the blade or bit does most of the work &mdash; a sharp, job-matched blade in a modest saw beats a worn general-purpose one in an expensive saw. Tell us what you are cutting and we can point you at the right tooth count or bit type.",
    faqs: [
      { q: "What does a brushless motor actually change?",
        a: "A brushed motor uses carbon brushes rubbing on a commutator to switch current as the motor turns. That contact wears, wastes energy as heat and eventually needs replacing. A brushless motor does the switching electronically instead, so less energy is lost, the tool runs cooler, the motor lasts longer, and it can sense load and adjust. In practice you get more runtime per charge and a lighter tool for the same power, at a higher purchase price." },
      { q: "Which saw blade do I want?",
        a: "Tooth count is the short answer. Fewer, larger teeth cut fast and rough, which is what you want ripping framing lumber; more teeth cut slower and cleaner, which is what you want crosscutting trim or plywood you will see. A 24-tooth circular blade is a framing blade; a 60- or 80-tooth is a finish blade. For reciprocating saws, tooth pitch and blade material matter more than length &mdash; bi-metal for mixed material and demolition, finer teeth for metal." },
      { q: "Should I buy an impact driver or a drill?",
        a: "They are not the same tool. A drill applies steady rotation and is what you want for drilling holes and for anything needing controlled torque, like a hole saw or a spade bit. An impact driver adds rapid rotational hammering, which drives long screws and lags with far less strain on your wrist, but it is loud and too aggressive for delicate work. Most people who do both end up owning both, which is why they are so often sold as a pair." }
    ]
  },

  fasteners: {
    intro: "Our fastener aisle holds screws, bolts, nuts, washers, anchors and builders hardware in zinc, stainless and brass, in SAE and metric, and we sell by the piece as well as by the box &mdash; useful when a job needs four of something rather than a hundred. The same aisle handles key cutting. Picking a fastener is mostly about three questions: what is it going into, how much load is on it, and will it get wet. Wood, drywall, masonry and steel each want a different fastener, and drywall in particular holds almost nothing on its own, so the anchor is doing the work. Outdoors or anywhere damp, stainless or a proper coating is what stops a rusted head shearing off later.",
    faqs: [
      { q: "How do I choose a wall anchor?",
        a: "Start with what the wall is. Into a stud, skip the anchor and use a screw long enough to bite about an inch of solid wood. Into hollow drywall, a plastic expansion plug suits light loads, a self-drilling threaded anchor holds more, and a toggle that spreads behind the board holds the most &mdash; that is what a heavy shelf or a grab bar needs. Into brick, block or concrete, you drill with a masonry bit and use a screw or sleeve anchor sized to the hole. If the load is overhead or safety-critical, find a stud or a structural fixing." },
      { q: "What do the numbers on a screw mean?",
        a: "For a wood screw, the first number is the gauge &mdash; the shank diameter, where a bigger number is thicker &mdash; and the second is length in inches, so a #8 x 1&frac12;&Prime; is a mid-weight screw an inch and a half long. Machine screws and bolts are called out by diameter, threads per inch and length, as in &frac14;-20 x 1&Prime;. Metric runs diameter, thread pitch, length: M6 x 1.0 x 20. If you are matching an existing fastener, bring it in; a gauge on the counter settles it in seconds." },
      { q: "What is a key blank, and why can some keys not be copied?",
        a: "A blank is an uncut key with the right profile for a given lock brand and keyway &mdash; the ridges along its length that let it enter that cylinder at all. Cutting a copy means matching the blank first, then grinding the depths from your original. Two things stop a copy: a key on a restricted or patented profile, where the blanks are controlled and only an authorised dealer can supply them, and a key with a transponder chip or high-security laser milling, which needs programming or specialised equipment. Ordinary house, office and padlock keys are the everyday case." }
    ]
  },

  snow: {
    faqs: [
      { q: "Which ice melt should I use, and will it hurt my concrete?",
        a: "Plain rock salt (sodium chloride) is the cheapest and works down to roughly 15&ndash;20&deg;F, losing effectiveness fast below that. Calcium chloride works far colder, gives off heat as it dissolves and acts quickly. Magnesium chloride and CMA blends are milder and are what most pet-safe products are built from. On concrete, the real damage is usually not chemical but physical: melt water soaks into the slab, refreezes and spalls the surface. Concrete poured within the last year is most at risk, and so is anything that was not air-entrained or properly cured. Shovel first, use the least product that does the job, and clear the slush rather than leaving it to refreeze." },
      { q: "How much ice melt do I actually need?",
        a: "Less than most people spread. A thin, even scatter is what works &mdash; ice melt is there to break the bond between ice and pavement so you can lift it, not to melt a storm away. Piling it on wastes product, tracks indoors, and puts more chloride into the soil at the edges of the walk. Spreading before a storm, so ice cannot bond in the first place, uses far less than trying to burn through afterwards." },
      { q: "What is a roof rake for?",
        a: "It is a long-handled blade for pulling snow off the lower few feet of a roof from the ground. The point is ice dams: heat escaping through the roof melts snow higher up, the water runs down to the cold overhang, refreezes, and the ridge that forms backs water up under the shingles. Clearing the bottom edge removes the snow that feeds the dam. Work from the ground, mind overhead lines, and never get on an icy roof." }
    ]
  },

  garden: {
    intro: "The seasonal aisle changes with the calendar: shovels, rakes, hoes and hand tools, hoses, nozzles and sprinklers, grass seed, fertilizer, soil and mulch, pest and weed control, and refuse and compost gear &mdash; then ice melt and snow shovels when the weather turns. Timing matters more than product choice for most lawn and garden work. Cool-season grasses of the sort grown in this part of New York establish best in late summer and early autumn, when the soil is still warm but the heat has broken, and spring is the second-best window. Watering deeply and less often pushes roots down; a light daily sprinkle keeps them at the surface where they dry out first.",
    faqs: [
      { q: "When is the best time to seed a lawn here?",
        a: "For the cool-season grasses common in the Northeast &mdash; fescue, ryegrass, Kentucky bluegrass &mdash; late summer into early autumn is the strongest window. The soil is still warm enough for fast germination, nights have cooled, and the weeds that compete hardest in spring are past their peak. Spring seeding works but gives the new grass less time to root before summer heat. Either way, seed needs consistent moisture until it is up, which usually means light watering more than once a day for the first couple of weeks." },
      { q: "What hose size and length should I get?",
        a: "Most household hoses are &frac58;&Prime; inside diameter, which balances flow against weight and is what nozzles and sprinklers are designed around. &frac34;&Prime; moves noticeably more water and is worth it on long runs or with several sprinklers, at the cost of a much heavier hose. Length costs you pressure: every extra foot drops flow a little, so buying far more hose than you need makes sprinklers work worse. Measure the longest run you actually water and add a little slack." },
      { q: "Do I need to drain hoses and outdoor spigots for winter?",
        a: "Yes. Water left in a hose or in the pipe behind an outdoor spigot expands when it freezes and can split either one. Disconnect and drain hoses before the first hard freeze, store them somewhere they will not be crushed, and shut off and drain the supply to the spigot if it is not a frost-free type. A frost-free hydrant still needs the hose disconnected, or it cannot drain and the freeze protection does nothing." }
    ]
  },

  cleaning: {
    intro: "Our cleaning and jan-san aisle stocks contractor and kitchen trash bags, mops, brooms, buckets and microfiber, household and industrial cleaners, degreasers and disinfectants, WD-40 and specialty aerosols, and paper goods and dispensers. Two things are worth knowing before you buy. Trash bags are rated in mils &mdash; thousandths of an inch &mdash; and the number matters more than the gallon size: a 3-mil contractor bag will carry demolition debris that tears a 0.9-mil kitchen liner instantly. And most concentrated cleaners are sold to be diluted; using them neat wastes product, leaves a film that attracts dirt faster, and on some surfaces does damage. The dilution on the label is the tested one.",
    faqs: [
      { q: "What do the mil ratings on trash bags mean?",
        a: "A mil is a thousandth of an inch of film thickness. Kitchen liners run around 0.7&ndash;1 mil, general commercial liners around 1.5, and contractor bags 3 mil and up. Thickness is what resists puncture and tearing, so it is the number that matters when the load has corners: sheetrock offcuts, tile, brush, anything with a broken edge. For soft rubbish, a thinner bag in the right size is cheaper and works fine. Gallon capacity tells you the volume, not the strength." },
      { q: "Can I mix cleaning products to make them work better?",
        a: "No &mdash; and two combinations are genuinely dangerous. Bleach mixed with any ammonia-containing cleaner produces chloramine gas; bleach mixed with an acid, including some descalers and toilet cleaners, releases chlorine gas. Both cause real harm in an ordinary bathroom-sized room. Beyond the hazard, mixing usually cancels the products out rather than combining them. Use one product, rinse, ventilate, and use the next if you need to." },
      { q: "What is the difference between cleaning, sanitizing and disinfecting?",
        a: "Cleaning physically removes soil and a good share of what is living in it, usually with detergent and agitation. Sanitizing reduces the remaining microorganisms to a level judged safe. Disinfecting is the strongest step and is aimed at killing them on a hard surface. Disinfectants only work if the surface is clean first, and nearly all of them need a stated dwell time &mdash; the surface has to stay visibly wet for that long. Wiping a disinfectant straight off does very little." }
    ]
  },

  roofing: {
    intro: "Our roofing and masonry shelves carry roof cements and elastomeric coatings, flashing, roofing felt and leak-repair tapes, Quikrete concrete, mortar and patching compounds, thin-set and grout for tile, and the trowels, floats and safety gear that go with them. Roof products divide roughly into two jobs. Repair products &mdash; wet-patch cements and flashing tapes &mdash; are for sealing a specific failure, and most are formulated to go down on a damp or cold surface because that is when roofs leak. Coatings are a whole-surface treatment: they go over a sound roof to reflect heat and slow weathering, and they will not rescue a substrate that has already failed. Cement products have a shelf life and a temperature window, both printed on the bag.",
    faqs: [
      { q: "What is the difference between concrete, mortar and cement?",
        a: "Cement is the binder, the grey powder that reacts with water. Concrete is cement plus sand plus stone aggregate, and it is a structural material &mdash; slabs, footings, posts. Mortar is cement plus sand with no large aggregate and additives for workability, and its job is to bond masonry units together, so it is deliberately weaker and more flexible than the brick or block it holds. Using concrete where mortar belongs gives you a joint harder than the brick, which then cracks the brick instead of the joint." },
      { q: "Can I patch a roof in the rain or the cold?",
        a: "Some products are made for exactly that. Wet-patch roof cements are formulated to adhere to damp surfaces and to stay workable in cold weather, which is the whole reason they exist. They are a repair, though, not a rebuild: they buy time on a specific leak. Coatings and adhesives are different &mdash; most have a minimum application temperature and need a dry, clean substrate to cure properly, and going on outside that window is the usual reason a coating fails early. The label states the conditions." },
      { q: "How much concrete does a project need?",
        a: "Work in volume. Length times width times depth in feet gives cubic feet; divide by 27 for cubic yards. An 80-pound bag of ready-mix yields about two-thirds of a cubic foot, so a small slab adds up quickly. Setting a fence post is the common case: a hole roughly three times the post width and a third of the post length deep, with the post set on gravel for drainage. Mix a little more than the arithmetic says, since nothing ever comes out exactly level." }
    ]
  }
};

let changed = 0;
for (const [slug, add] of Object.entries(CONTENT)) {
  const p = path.join(D, slug + '.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (add.intro) data.intro = add.intro;
  data.faqs = add.faqs;
  fs.writeFileSync(p, JSON.stringify(data, null, 1) + '\n');
  const words = (add.intro || data.intro || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  console.log(`${slug.padEnd(11)} intro ${String(words).padStart(3)} words, ${add.faqs.length} FAQs`);
  changed++;
}
console.log(`\n${changed} department content files updated`);
