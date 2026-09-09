# Content sources

Every **store-specific claim** added in the content pass, with where it came
from. Under the grounding rules, a store claim may only come from copy
already in this repo, a subject row in `IMAGE-MANIFEST.md`, or an explicit
statement from the owner. Anything that needed a fourth source was left out
and recorded in `OPEN-CONTENT-QUESTIONS.md` instead.

General educational writing — how a spectrophotometer works, what a mil
rating means, why ice melt damages concrete, what a key blank is — is **not**
listed here. It carries no store claim, and it is written so it never reads
as a store promise.

Line numbers refer to the state of the repo at the Package 2 commit.

---

## The five verified anchors

These recur across the site, so they are listed once.

| Claim | Where it now appears | Source |
|---|---|---|
| Family-run since **1966** | homepage why-us band, `llms.txt`, page titles | `src/_data/site.json:5` (`foundingDate`), `src/pages/about.njk:23` ("Founded in **1966**") |
| **Benjamin Moore dealer** | homepage why-us band, `llms.txt`, index/about titles, About figure caption ("A Benjamin Moore dealer.") | `src/_data/site.json:49` (brand list), `src/pages/index.njk:21` ("Proudly partnering with" + Benjamin Moore logo) |
| **Keys cut while you wait**, about two minutes | why-us band, fasteners intro, services detail | `src/_data/services.json:7` ("cut while you wait"), `src/_data/services.json:5` ("2-Min" badge), `src/_data/faqs.json:16` ("under two minutes") |
| **Local delivery** to Yonkers, Bronxville, Mt Vernon, Hastings-on-Hudson | why-us band, `llms.txt`, delivery service detail | `src/_data/services.json:65` |
| **Hablamos español** / Spanish-speaking staff | why-us band, Contact page Spanish paragraph, `llms.txt` | `src/pages/index.njk:15` (hero), `src/pages/about.njk:32` ("Spanish-Speaking Staff") |

---

## Owner statements, 2026-08-30

The store owner answered the open questions on 2026-08-30. Under the
grounding rules an explicit statement from the owner is a valid source, so
these claims are sourced to that conversation rather than to repo copy.

| Claim | Where it appears | Source |
|---|---|---|
| The shop outgrew its first home and later moved into the larger building it occupies today. **Deliberately undated** — no date was given. | About page, "Our Story" | owner statement, 2026-08-30 |
| The family is **not** to be named, and neither is the generation. The story stays "family-run since 1966". | About page (an omission, recorded so it is not "fixed" later) | owner statement, 2026-08-30 |
| The staff member in the store T-shirt is **Mike, the owner**, confirmed OK to feature. First name only, never a surname. | About page lead figure, Services page lead figure, and the alt text of both | owner statement, 2026-08-30 |
| Prices confirmed current: **keys from $2**, **delivery from $15** within roughly a **7-mile radius**, **sheet-rock first two cuts free then $1 each**. Marked "(as of 2026)" at each price’s first appearance on a page. | Services page (key note, delivery service FAQ), FAQ page (cutting and delivery answers) | owner statement, 2026-08-30 |
| The "Standard Keys $2.00" sign visible in `service-key-wall-signage-01.webp` is accurate, unblocking that image. | Services page, key-duplication card | owner statement, 2026-08-30 |
| Benjamin Moore Aura **goes on promotion regularly** — recurring, not a live offer. No percentage, no "currently". | FAQ page, paint section | owner statement, 2026-08-30 |
| **Street parking along Main Street, plus parking garages nearby.** Nothing is said about step-free access: it was not answered. | Contact page (beside the address) and the services FAQ | owner statement, 2026-08-30 |
| **Safeguard Lock & Key** is a current arrangement and they are happy with the link. | Homepage locksmith CTA, About page (no copy change; the claim is now sourced) | owner statement, 2026-08-30 |
| The Spanish paragraph on the Contact page is **approved**. | Contact page | owner statement, 2026-08-30 |

---

## Department intros and FAQs

Added in `tools/add-dept-content.js`, stored in `src/_data/deptdetail/*.json`.

| Department | Store-specific claim in the new copy | Source |
|---|---|---|
| Paint | Carries Benjamin Moore interior/exterior paint, primers, stains, clear finishes, brushes, rollers, tape, sandpaper, caulk | `src/_data/deptdetail/paint.json` sections `interior`, `exterior`, `primers`, `stain`, `sundries` |
| Paint | "we mix colour at the counter while you wait" | `src/_data/deptdetail/paint.json` section `match`; `src/_data/services.json:26` |
| Paint | "We scan on a Benjamin Moore spectrophotometer and keep the formula on file so a re-order matches" | `src/_data/services.json:26`, `src/_data/services.json:28` ("Formula stored for easy re-orders") |
| Paint | "flat sample at least an inch square" | `src/_data/faqs.json:10`, `src/_data/services.json:27` |
| Plumbing | Carries black iron, galvanized, copper, PEX, CPVC, PVC, brass valves, drain/DWV, sump and utility pumps, tape and dope | `src/_data/deptdetail/plumbing.json` sections `pipe`, `valves`, `drain`, `pumps`, `repair` |
| Plumbing | "cut and thread black iron or galvanized pipe up to 2″ NPT while you wait" | `src/_data/faqs.json:26`; `src/_data/deptdetail/plumbing.json` section `threading` |
| Electrical | Stocks NM-B and THHN wire, switches, outlets, GFCIs, wallplates, LED bulbs, cords, surge protection, timers, thermostats, connectors, boxes, conduit, batteries | `src/_data/deptdetail/electrical.json` sections `wiring`, `devices`, `lighting`, `cords`, `timers`, `specialty` |
| Tools | Carries cordless drills/impacts/saws, hand tools, blades and bits, measuring and layout, safety gear, jobsite storage | `src/_data/deptdetail/tools.json` sections `power`, `hand`, `blades`, `measure`, `safety`, `storage` |
| Fasteners | Screws, bolts, nuts, washers, anchors, builders hardware in zinc/stainless/brass, SAE and metric | `src/_data/deptdetail/fasteners.json` sections `screws`, `bolts`, `anchors`, `hardware`, `special` |
| Fasteners | "we sell by the piece as well as by the box" | `src/_data/deptdetail/fasteners.json:103` ("we sell by the piece, not just by the box") |
| Fasteners | Key cutting handled in the same aisle | `src/_data/deptdetail/fasteners.json` section `keys` |
| Snow | Original intro sentence kept verbatim; education appended | `src/_data/deptdetail/snow.json` (pre-existing `intro`) |
| Snow | Rock salt, calcium chloride, pet-safe magnesium/CMA blends stocked | `src/_data/departments.json:163`, `src/_data/departments.json:164` |
| Garden | Shovels, rakes, hoes, hand tools, hoses, nozzles, sprinklers, seed, fertilizer, soil, mulch, pest and weed control, refuse and compost | `src/_data/deptdetail/garden.json` sections `handtools`, `watering`, `lawncare`, `winter`, `refuse` |
| Cleaning | Contractor and kitchen bags, mops, brooms, buckets, microfiber, cleaners, degreasers, disinfectants, WD-40 and aerosols, paper goods and dispensers | `src/_data/deptdetail/cleaning.json` sections `bags`, `mops`, `chem`, `lubes`, `disp` |
| Roofing | Roof cements and elastomeric coatings, flashing, felt, leak tapes, Quikrete concrete/mortar/patch, thin-set and grout, trowels, floats, safety gear | `src/_data/deptdetail/roofing.json` sections `roofcmt`, `leak`, `concrete`, `tile`, `tools` |

**Every other sentence in those intros and FAQs is general education**, written
to be accurate and non-promissory. Examples: interior vs exterior paint film
behaviour, how a spectrophotometer computes a recipe, push-to-connect vs
soldered copper, wire gauge to breaker pairing (with an explicit "confirm
with an electrician or your inspector"), lumens vs watts, brushless motors,
saw tooth counts, anchor selection, screw callouts, key blank basics, ice
melt chemistry and concrete spalling, lawn seeding timing, hose diameter,
trash bag mil ratings, the bleach/ammonia and bleach/acid hazards,
clean-vs-sanitize-vs-disinfect, and cement vs concrete vs mortar.

---

## Services page

Added in `tools/add-service-content.js`, stored in `src/_data/services.json`.

| Service | Store-specific claim | Source |
|---|---|---|
| Key Duplication | House, office and padlock keys; blanks stocked; restricted/transponder limits | `src/_data/services.json:7-10`; `src/_data/faqs.json:19-20` (transponder/laser referral) |
| Paint Color Matching | Spectrophotometer scan; sample size; formula kept on file | `src/_data/services.json:26-28` |
| Repairs & Assembly | Wheelbarrows, hand trucks, small lawn tools, minor assembly | `src/_data/services.json:40-42` |
| Local Delivery | Paint pails, sheet-rock, lumber, bulk bags; named towns; curb-side or inside-threshold | `src/_data/services.json:63-66` |
| Bulk & Contractor | Pallet pricing on Quikrete, sheet goods, paint; resale/tax form opens an account | `src/_data/services.json:79-80`, `src/_data/services.json:86` |
| Service FAQs | No appointment; 7-mile delivery radius; invoice/quote matching | `src/_data/servicefaqs.json:3`, `:5`, `:7` |

---

## Guides (2026-08-30 pass)

Five guides at `/guides/`. **The body of every guide is general education and
carries no store claim.** Only the closing "Where to start" paragraph ties
back to the store, and every claim in those paragraphs traces to a source
already in this document.

| Guide | Store claim in the closing paragraph | Source |
|---|---|---|
| Choosing ice melt | Stocks rock salt, calcium-chloride pellets, pet-safe magnesium and CMA blends; biggest winter category, stocked early and restocked often | `src/_data/departments.json` snow points and blurb |
| Choosing ice melt | Pallet quantities | `src/_data/departments.json` snow points ("Pallet pricing &amp; forklift loading available") |
| Choosing ice melt | Delivery from $15 (as of 2026), roughly a seven-mile radius | owner statement, 2026-08-30 |
| Paint sheen | Benjamin Moore dealer | `src/_data/site.json`, `src/pages/index.njk` |
| Paint sheen | Interior lines in matte, eggshell, pearl and semi-gloss | `src/_data/deptdetail/paint.json` section `interior` |
| Paint sheen | Colour matching at the counter, sample ≥ 1 inch square, formula kept on file | `src/_data/services.json`, `src/_data/faqs.json` |
| Wall anchors | Stocks plastic plugs, threaded anchors, togglers, concrete screws, sleeve anchors | `src/_data/deptdetail/fasteners.json` section `anchors` |
| Wall anchors | Sold by the piece as well as by the box | `src/_data/deptdetail/fasteners.json:103` |
| Wall anchors | Tools department carries drills and bits | `src/_data/deptdetail/tools.json` sections `power`, `blades` |
| Interior painting prep | Carries primers, caulks, tapes, sandpaper, brushes | `src/_data/deptdetail/paint.json` sections `primers`, `sundries` |
| Key types | Keys cut while you wait, about two minutes, from $2 (as of 2026) | owner statement, 2026-08-30; `src/_data/services.json` |
| Key types | Chip-less automotive/motorcycle, colored, contractor and novelty blanks; re-keying Kwikset and Schlage | `src/_data/services.json` key-duplication bullets |
| Key types | Transponder and laser keys need a locksmith | `src/_data/faqs.json` keys section |
| Key types | Key wall sits with cabinet locks, hasps and gate hardware | `src/_data/deptdetail/fasteners.json` sections `keys`, `hardware` |

Four phrases were cut during review for drifting past their source: "before
the first forecast", "the full sheen range", "hammer drills", and "fillers".
None had a source in this document.

**No price appears in any guide except the two the owner confirmed**, each
marked "(as of 2026)".

---

## Google reviews, 2026-08-30

Eight reviews quoted from the owner's Google Business Profile review dump
(saved verbatim at `triage/reviews-raw.txt`, gitignored). Each is logged as
**"Google review, &lt;display name&gt;"**, quoted as published, attributed by
the display name exactly as it appears, and labelled visibly on the page.

**No `Review`, `AggregateRating`, `reviewRating`, `ratingValue` or
`reviewCount` markup exists anywhere on the site.** Marking up reviews of
yourself is self-serving review markup and against Google's policy. These are
visible content only, verified by scanning every JSON-LD block on all 25
pages.

| Quote (opening) | Source |
|---|---|
| "The owners are extremely nice. Lost my phone on the train…" | Google review, yuen ki chan |
| "Great new hardware store in Getty Square…" | Google review, Amanda |
| "Super helpful. Helped put items together on the spot for us…" | Google review, David Michael |
| "Best store ever! They are extremely helpful and honest…" | Google review, Sherry Bobrowsky |
| "This local hardware store has been a lifesaver…" | Google review, Edwin Mejia |
| "A small hardware store, but I found everything I was looking for, including a key copy." | Google review, Marijo |
| "They are my got to guys if they don't have it they will find it for you." | Google review, Juan Cotto |
| "Great guys, really helped me out and went above and beyond for me" | Google review, Erik Jacobsen |

Quoting is verbatim: a check reads the published text back against the dump
and confirms all eight appear in it exactly. Only two alterations were made,
both permitted: emoji dropped from the yuen ki chan quote, and no ellipsis
trimming was needed on any of the eight. Typos in the originals ("my got to
guys") are preserved.

### Corroboration these reviews provide

Two facts already published are independently corroborated here, which is
worth noting because both came from single sources before:

- **Getty Square** — "Great new hardware store in Getty Square" (Amanda), and
  Larry Mac Kinnon's unpublished review names 65 Main Street as the new
  location.
- **The store moved around the corner** — "Local company that just moved
  around from the corner so not a new business" (David Michael).

### Reviews deliberately not used

| Reviewer | Reason |
|---|---|
| Antonio | The snow-shovel story, but **truncated** in the dump ("…the guy showed me… View full review"). The intact portion is scene-setting, not praise, so it does not stand alone. Not completed, not guessed. |
| "Yonkers" | The property-manager account, **truncated** ("…doing business with them and they… View full review"). Excluded by instruction. |
| Mark Elliott | **Truncated** ("…every time I… View full review"). Intact portion would stand alone but adds nothing the eight do not cover. |
| Anthony Nelson | The lock-return story: **mixed**, and truncated. |
| Martha Roberts | "Can be good, mostly when they have time to talk and explain." **Mixed.** |
| New Beginnings Daycare | Names **Ralph**, who is not in this document. Not confirmed, not published. |
| 11 reviewers | Star rating only, no text to quote. |
| 8 reviewers | Generic one-liners ("Great service.", "Got everything I need") passed over in favour of specific ones. |

---

## Google Business Profile facts, 2026-08-30

The Business Profile is owner-controlled, so its attributes are a valid
source under the grounding rules. These are logged as
**"GBP, owner-controlled, 2026-08-30"**.

| Claim | Where it appears | Source |
|---|---|---|
| The entrance is **wheelchair accessible** | Contact page, beside the parking note; `amenityFeature` in the HardwareStore schema; `llms.txt` | GBP, owner-controlled, 2026-08-30 |
| **Not cash-only**: credit, debit and NFC mobile payments accepted | Contact page; a services FAQ; `paymentAccepted` in the schema; `llms.txt` | GBP, owner-controlled, 2026-08-30 |
| **Same-day delivery is offered** | `/delivery.html`, framed as call-to-confirm | GBP, owner-controlled, 2026-08-30 (corroborates the existing "Same-Day" badge in `src/_data/services.json`) |
| 65 Main Street is in **Getty Square**, downtown Yonkers | Contact page once, homepage once, `llms.txt` description | GBP, owner-controlled, 2026-08-30; corroborated by customer reviews |
| The store moved **just around the corner** into its current larger building | About page, "Our Story". Still undated | owner statement, 2026-08-30, plus two corroborating Google reviews |
| Store hours **verified against the Business Profile**: Mon–Fri 8:30 AM–6:00 PM, Sat 10:00 AM–5:00 PM, Sun closed — an exact match to `site.json`, and therefore to the footer, Contact, thanks, the `openingHoursSpecification` and `llms.txt`, which all render from it | Everywhere hours appear | GBP, owner-controlled, 2026-08-30 |

**Deliberately still absent from the delivery page:** any same-day cut-off
time and any minimum order. Both remain open questions. The same-day copy
says to call and ask rather than implying a deadline exists — verified by
scanning the rendered page for cut-off, cutoff, minimum, order by and
deadline: none present.

**Deliberately not widened:** the GBP service area lists Bronx, Westchester
and Rockland, which conflicts with the sourced seven-mile radius and the four
named towns already on the site. Nothing was changed; the conflict is
recorded as an open question for the owner to rule on.

---

## Delivery page (/delivery.html)

Built only from claims already in this document. Nothing new was introduced.

| Claim | Source |
|---|---|
| Delivers to Yonkers, Bronxville, Mt Vernon, Hastings-on-Hudson | `src/_data/services.json` local-delivery bullets |
| Roughly a seven-mile radius | `src/_data/servicefaqs.json` |
| From $15 (as of 2026) | owner statement, 2026-08-30 |
| Paint pails, sheet-rock, lumber, bulk bags | `src/_data/services.json` local-delivery bullets |
| Curb-side or inside-threshold | `src/_data/services.json` local-delivery bullets |
| Heavy or pallet loads quoted individually | `src/_data/faqs.json` services section |
| "Prices current as of 2026; confirm at the counter" | owner statement, 2026-08-30 |

**Deliberately absent:** any same-day cut-off time and any minimum order. Both
are still open questions, and the copy is written so it implies neither — it
says to call and arrange, never that a deadline or a threshold exists.

---

## Captions and alt text

All alt text continues to come from `IMAGE-MANIFEST.md` via
`src/_data/imagemeta.json` — unchanged in this pass. Captions are new, and
each describes only what is visible in its frame.

| Caption | Image | Note |
|---|---|---|
| "Keys cut at the counter while you wait." | `service-key-cutting-action-01.webp` | Manifest subject row: staff cutting a key at the counter |
| "The Benjamin Moore colour wall the matching draws on." | `dept-paint-color-wall-03.webp` | Manifest: "Benjamin Moore Classics colour chip wall" |
| "Stock on the shelves, ready to load out." | `interior-aisle-01.webp` | Manifest: aisle of packaged hardware |
| "The Benjamin Moore colour centre, where matching starts." | `dept-paint-color-center-01.webp` | Manifest: Benjamin Moore colour centre display |
| "Numbered aisles, so you can find it or we can point you at it." | `interior-aisle-numbered-01.webp` | Manifest: numbered aisle signs |
| "The key wall: house, office and padlock blanks." | `service-key-blanks-01.webp` | Manifest: rows of key blanks; key types from `src/_data/services.json:7` |
| "Benjamin Moore Regal Select on the shelf." | `dept-paint-regal-cans-01.webp` | Manifest: Regal Select cans |
| "65 Main Street, Yonkers." | `storefront-exterior-01.webp` | Manifest storefront row; address from `src/_data/site.json` |
| "Inside: aisles stocked front to back." | `interior-aisle-01.webp` | Manifest aisle row |
| "A Benjamin Moore dealer." | `brand-benjamin-moore-sign-01.webp` | Manifest: illuminated Benjamin Moore dealer sign |

The other ambiguity-flagged image, `dept-fasteners-pegboard-01.webp`, is
placed only as a department photo and carries **no caption** — its manifest
alt already says "packets of small hardware" without naming the contents.

### Replacement captions

Two service cards lost their photograph when the images above were withdrawn.
Both were refilled with **non-person** images, so no decision about who may
be featured was made on the owner's behalf.

| Caption | Image | Source |
|---|---|---|
| "Blades, bits and abrasives in the tool aisle." | `dept-tools-accessories-01.webp` | Manifest alt: "a wall of packaged drill bits, driver bits and saw blades in the tool aisle" |
| "Paint stacked by the case." | `dept-paint-aisle-01.webp` | Manifest alt: "shelves stacked with cans of Benjamin Moore paint along a store aisle" |

### Withdrawn captions

Three captions were removed with their images when those images were
withdrawn for showing a person not affiliated with the store. Nothing else
depended on them, and no body copy referred to the photographs.

| Removed caption | Image | Was on |
|---|---|---|
| "Outside the shop on Main Street." | `staff-team-storefront-01.webp` | About page lead figure |
| "Working through a repair at the counter." | `service-counter-advice-01.webp` | Services, Repairs & Assembly card |
| "At the counter, where accounts and bulk orders are set up." | `service-counter-customer-01.webp` | Services, Bulk & Contractor card, and the Contact page figure |

Their alt text is unchanged in `IMAGE-MANIFEST.md`; only the placements and
captions are gone. See `IMAGE-MANIFEST.md` for the do-not-place markers.

---

## Contact page, Spanish paragraph

New Spanish copy, marked `lang="es"`. It contains **no claim that is not
already on the site in English**: a greeting, that we speak Spanish, the
phone number, and the address. Sources: `src/pages/index.njk:15` and
`src/pages/about.njk:32` for the Spanish-speaking staff claim; `site.json`
for the phone and address. Flagged in `REPORT.md` for owner review, since
nobody in this repo has verified the Spanish wording.

---

## llms.txt

Generated at build time from `site.json`, `departments.json` and
`services.json`. The one-paragraph description is assembled only from the
five verified anchors above plus the department list. `tools/check-entity.js`
asserts it matches `site.json` exactly on name, address, phone, email,
`sameAs`, `hasMap`, hours and founding year.
