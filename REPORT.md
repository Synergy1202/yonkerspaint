# Content, search and finish pass — report

The architecture was already done. This pass deepened the writing, made the
site legible to search engines and AI assistants, and finished the visuals.
No new pages, no tracking, no invented facts.

---

## Lighthouse, before and after

Desktop preset, run against a local server. Reproduce with
`node tools/lighthouse.js triage/lh-after <port>`.

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| index.html | 99 → **99** | 100 → **100** | 100 → **100** | 100 → **100** |
| departments.html | 100 → **94** | 95 → **95** | 100 → **100** | 100 → **100** |
| paint.html | 100 → **100** | 100 → **100** | 100 → **100** | 100 → **100** |
| services.html | 100 → **100** | 95 → **100** | 100 → **100** | 100 → **100** |
| contact.html | 99 → **99** | 100 → **100** | 100 → **100** | 100 → **100** |

Targets were 95+ accessibility and SEO, 90+ performance. **All met.**

Two things worth reading rather than skimming:

**services.html accessibility 95 → 100.** The baseline run found a real
defect my own contrast tool structurally could not: the rule
`.services .card > p:last-child` (specificity 0,3,1) was overriding
`.badge`'s colour (0,1,0), so the "Free with paint purchase" badge rendered
`--text-muted` on `--secondary` — **1.04:1**. `tools/contrast.js` checks the
token pairs a designer *intends*; only a browser sees which one wins the
cascade. Fixed by replacing the blanket rule with an explicit
`.service-note` class.

**departments.html performance 100 → 94, and its 95 accessibility.** Both
trace to one thing, and it is a measurement artifact rather than a user
problem. Lighthouse reports CLS 0.145 and a target-size failure on the
jump-link chips, reproducibly across runs. Lighthouse's own final screenshot
(`triage/dept-final.jpg`) shows why: **the departments dropdown is rendered
open in headless Chrome**, overlapping the chips beneath it. A real visitor
only opens that menu by hovering, focusing or tapping it, and layout shifts
within 500 ms of user input are excluded from field CLS. I tested and
rejected three other explanations before concluding this — chip wrap reflow,
`:focus-within`, and font-swap reflow — and reverted the speculative fix I
had added for the first of them. Worth re-checking against field data once
the site has real traffic.

---

## Per-page payload

First-visit transfer size: HTML plus every asset the page references.

| Page | Total | | Page | Total |
|---|---|---|---|---|
| fasteners.html | 1,142 KB | | contact.html | 501 KB |
| cleaning.html | 851 KB | | services.html | 493 KB |
| paint.html | 795 KB | | roofing.html | 386 KB |
| **index.html** | **768 KB** | | electrical.html | 221 KB |
| tools.html | 757 KB | | garden.html | 221 KB |
| plumbing.html | 727 KB | | snow.html | 221 KB |
| about.html | 708 KB | | reviews.html | 220 KB |
| departments.html | 689 KB | | faq.html | 220 KB |
| | | | thanks.html / 404.html | 212 KB |

Homepage **768 KB** against a 1.2 MB budget. Whole upload 5.3 MB. Every page
grew — more words, more photographs — and all stayed inside budget.

Other budgets: `site.css` **40.2 KB** of 45 KB. Fonts **52.4 KB** of 120 KB,
unchanged.

---

## What changed, page by page

**Homepage** — A "Why neighbors choose us" band built strictly from the five
verified anchors (1966, Benjamin Moore dealer, keys while you wait, local
delivery, hablamos español), each with an icon. An "A look inside" gallery
placing four photographs that had never been used. Title rewritten to lead
with what the store is. Band alternation so no two adjacent sections share a
background.

**Departments overview** — New title and description. Brands strip on the
tint panel. Chips given a 44 px minimum target.

**The 9 department pages** — The substantial change. Each gained a 110–138
word answer-first intro whose first sentence says what the department
carries, then three FAQs as disclosures. Each links to two or three related
departments and its relevant in-store service, with descriptive anchors. New
intent-matched titles with a local modifier ("Paint Store in Yonkers, NY").
`BreadcrumbList` and `FAQPage` schema on all nine.

**Services** — Every service expanded with *what it is*, *when you need it*,
and *what to bring*, each with an icon and a captioned photograph. The
copy moved from markup into `src/_data/services.json`, so the page and the
`Service` schema now share one source — verified by diffing the rendered
text before and after the extraction: **byte-identical**. Five `Service`
nodes plus `FAQPage`. Each card links back to the departments it serves.

**About** — Storefront, interior and Benjamin Moore dealer-sign photographs
with captions. Story copy untouched. (Its lead figure was withdrawn — see 4a.)

**Contact** — A short Spanish paragraph in a `lang="es"` container and a new
title. (Its counter photograph was withdrawn — see 4a.)

**FAQ / Reviews / 404 / thanks** — New titles; picked up the shared visual
changes.

**Site-wide** — Self-hosted icon set used consistently in services, the
footer and the why-us band, all `aria-hidden` with text doing the labelling.
One `.figure` photo treatment everywhere. `llms.txt` generated at build
time. `robots.txt` explicitly allowing ten AI crawlers.

---

## Flags for you

### 1. The Spanish paragraph — **approved, flag cleared**

`src/pages/contact.njk` carries a short Spanish paragraph, because the
homepage has advertised "¡Hablamos Español!" all along. The owner approved it
on 2026-08-30, so this is no longer an open item.

The follow-on question stands but is not urgent: whether a full Spanish
version of the site is worth it. That is a content commitment, not a
translation job.

### 2. Open content questions — most now answered

The owner answered on 2026-08-30. `OPEN-CONTENT-QUESTIONS.md` keeps the
resolved items rather than deleting them, so the record of what was asked
and what was **deliberately declined** survives.

Resolved: the family-naming question (declined — do not "fix" it later), the
relocation waypoint, the three prices, the Aura promotion, parking, the
Spanish paragraph, the Safeguard arrangement, and the owner's photographs.

Still open, and worth chasing:

- **Step-free access at the entrance.** The parking half was answered; this
  half was not, and nothing about accessibility is published.
- **Contractor account terms**, **rentals/propane/screens**, **holiday
  hours**, and the **delivery cut-off**.
- Two image questions: what is on the pegboard in
  `dept-fasteners-pegboard-01.webp`, and the held background person in
  `service-counter-customer-01.webp`.

Two of the owner's reply numbers could not be matched to a question and are
listed as unmatched at the end of that file rather than guessed at.

### 3. Every store claim is sourced

`CONTENT-SOURCES.md` logs each store-specific claim added, with the file and
line it came from. General education — how a spectrophotometer works, ice
melt chemistry, mil ratings, key blanks — is listed separately and phrased so
it never reads as a store promise. Three claims spot-checked against their
cited lines during the pass; all matched.

### 4. Five manifest images unplaced

34 of 39 are in use, up from 31 before the owner's answers. Three of the
five that remain out are the withdrawn or held images in 4a below.

| Image | Why it is out |
|---|---|
| `staff-team-storefront-01.webp` | **Withdrawn** — person not affiliated (4a) |
| `service-counter-advice-01.webp` | **Withdrawn** — person not affiliated (4a) |
| `service-counter-customer-01.webp` | **Held** for your call — background figure (4a) |
| `staff-portrait-doorway-01.webp` | Alternate portrait of Mike. The landscape storefront crop sits better in the About lead slot; this one is available if you prefer it |
| `dept-paint-color-wall-02.webp` | Portrait sibling of the homepage hero. Reserved for a future art-directed mobile hero |

`service-key-wall-signage-01.webp` and `staff-portrait-storefront-01.webp`
and `service-counter-portrait-01.webp` all moved from held to placed once the
owner confirmed the price and cleared the photographs.

### 4a. Three images withdrawn — person not affiliated with the store

A person appearing in the shoot is not someone the store can feature. Every
image in `images/` was inspected at full resolution, matching on the face
rather than the clothing.

**Confirmed and removed (2):**

| Image | Where he is | Was placed on |
|---|---|---|
| `staff-team-storefront-01.webp` | Left of two men, face fully visible, blue-and-white checked shirt over white long sleeves | About page lead figure |
| `service-counter-advice-01.webp` | The man leaning over the counter, face in three-quarter view, same shirt | Services, "Repairs & Assembly" card |

**Held for your call (1):**

`service-counter-customer-01.webp` — the two people in the foreground are
**not** him (a customer in a grey tank top and backwards cap, and the
bald staff member in the store T-shirt). But there is a **third person in the
background**, behind the Woodluxe display: dark curly hair of the same shape,
and a blue-and-white checked garment visible below the shoulder. His face is
a small, out-of-focus profile, so I could not match on the face and did not
guess. Crop at `triage/audit/bg-third-person.jpg`.

I unplaced it anyway, pending your decision — leaving a probable match live
seemed the worse error, and putting it back is a one-line change. Its
manifest row is marked HELD rather than confirmed.

The other 36 images are clear. The bald staff member in the store T-shirt
appears in four images and is a different person throughout.

Masters in `dropbox/` are untouched. The build's prune drops the derived
files from the output automatically.

### 5. The photo gaps are unchanged — the reshoot list still stands

Nothing in this pass could fix these, and the writing works around them
rather than papering over them.

| Gap | Status |
|---|---|
| **Electrical** | Zero photographs. Renders as a designed flat panel. A live department with a nav entry and nothing to show |
| **Garden / seasonal** | Zero photographs. Same treatment |
| **Snow / ice melt** | Zero photographs. Same treatment. **Needs a winter shoot** — the existing set was a warm-weather session, so this has to be scheduled rather than discovered in November |
| **Paint mixing / colour matching in action** | Still the single most valuable missing frame. Key cutting has four photographs including a genuine in-action shot; the headline service for a Benjamin Moore dealer has none. The new colour-matching writing on the paint page and the services page both have a picture-shaped hole in them |
| **Power tools** | Only the accessory aisle. No shot of a Milwaukee or DeWalt display, for a store that leads with both brands |

---

## Verification

```
npm run build && npm run check:all
```

Six checks, all passing: links and assets, entity consistency, CSS rules and
budget, JSON-LD parsing on all 18 pages, the 28-pair contrast table, and the
UI glyph scan. `tools/lighthouse.js` reproduces the scores above.

`tools/check-entity.js` is new this pass: it asserts that name, address,
phone, email, `sameAs` and `hasMap` are identical across visible page copy,
the JSON-LD graph on every page, and `llms.txt`, and that all of it traces
back to `site.json`.

**Known limitation, stated plainly:** `tools/contrast.js` compares token
pairs, not computed styles. It cannot catch a specificity conflict like the
badge defect above. Lighthouse can, which is the argument for keeping both.
