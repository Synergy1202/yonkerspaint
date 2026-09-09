# Polish and expansion pass — report

Header and navigation redesign, footer upgrade, a visual sweep, an internal
link sweep, and a new Guides section. No new store claims, no tracking, no
Spanish beyond the approved paragraph.

---

## Lighthouse, before and after

Desktop preset against a local server. The "before" column is the last pass's
figures; `guides/wall-anchors.html` did not exist then.

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| index.html | 99 → **99** | 100 → **100** | 100 → **100** | 100 → **100** |
| departments.html | 94 → **99** | 95 → **100** | 100 → **100** | 100 → **100** |
| services.html | 100 → **99** | 100 → **100** | 100 → **100** | 100 → **100** |
| guides/wall-anchors.html | — → **100** | — → **100** | — → **100** | — → **100** |

**departments.html finally reached 100 on accessibility, and 99 on
performance.** That page carried a target-size finding and a CLS of 0.145
through two passes, which I traced last time to Lighthouse rendering the old
dropdown open in headless Chrome. Replacing that dropdown with the mega-panel
removed the finding outright — the diagnosis held up.

One real defect surfaced mid-pass: the footer's Instagram and email links
were stacked with `<br>` and sat too close to meet the WCAG 2.2 target-size
minimum, which knocked index, services and the guides from 100 to 96. They
are now list items with 44 px targets.

---

## Budgets

| Budget | Limit | Actual |
|---|---|---|
| `site.css` unminified | 55 KB | **54.5 KB** |
| Fonts (woff2) | 120 KB | **52.4 KB** (unchanged) |
| Homepage payload | 1.2 MB | **793 KB** |
| Each guide | 600 KB | **526 KB** max (`wall-anchors`) |

CSS is close to its ceiling. Three guide pages initially blew the 600 KB
budget because the hero loaded the 1600 px original; switching guide heroes
to the 800 px derivative brought the worst from 694 KB to 526 KB.

Whole site: 5.7 MB, 24 pages.

---

## New pages

| URL | Words | Schema | Hero |
|---|---|---|---|
| `/guides/` | index | HardwareStore | Flat panel |
| `/guides/choosing-ice-melt.html` | **797** | Breadcrumb + Article | Flat panel — no ice-melt photography exists |
| `/guides/wall-anchors.html` | **729** | Breadcrumb + Article | `dept-fasteners-bins-01` |
| `/guides/interior-painting-prep.html` | **721** | Breadcrumb + Article | `dept-paint-primer-shelf-01` |
| `/guides/key-types.html` | **707** | Breadcrumb + Article | `service-key-blanks-01` |
| `/guides/paint-sheen-guide.html` | **651** | Breadcrumb + Article | `dept-paint-color-wall-03` |

All within the 500–800 word brief. Each opens answer-first, runs pure
education, and touches the store only in a closing "Where to start"
paragraph. Every claim in those paragraphs is logged in
`CONTENT-SOURCES.md`; four phrases were cut in review for drifting past
their source ("before the first forecast", "the full sheen range", "hammer
drills", "fillers").

**Article, not FAQPage,** on all five. The content is prose with headings,
not question-and-answer — claiming FAQPage for it would be schema spam.
FAQPage stays where the markup genuinely is Q&A: the FAQ page, the services
page, and the nine department pages.

---

## Pages changed

**Every page** — new two-tier header, expanded footer (19 internal links, up
from 2), pre-footer CTA band, restyled disclosures.

**Department pages ×9** — visible breadcrumbs; guide links in the related
block where one applies; in-copy contextual links on five of them.

**Services** — guide links on three cards; a "Read more" line per card.

**Reviews** — testimonials rebuilt as pull-quotes.

**404 / thanks** — opt out of the CTA band via a `noCta` flag.

**Paint department** — `dept-paint-aura-shelf-01.webp` withdrawn. It shows
shelf-edge price tags that are not confirmed current, and this pass forbids
unconfirmed prices in imagery as well as text. Its manifest row is marked
do-not-place. That section now renders text-only.

---

## Internal link map

Body links only, excluding the header, footer and CTA band.

| Page | Links out | Where to |
|---|---|---|
| index | 11 | 9 departments, services, guides |
| services | 11 | 5 department groups, 4 guides, departments overview |
| departments | 9 | 9 department pages |
| paint | 9 | 3 departments, colour matching, 2 guides, breadcrumbs |
| fasteners | 7 | 2 departments, key duplication, 2 guides, breadcrumbs |
| garden, snow, tools | 7 | 3 departments, 1–2 services, 1 guide, breadcrumbs |
| plumbing, roofing | 6 | 3 departments, 1–2 services, breadcrumbs |
| cleaning, electrical | 5 | 2 departments, 1 service, breadcrumbs |
| each guide | 4–5 | 1–2 departments, 1–2 services, 1 sibling guide |
| guides index | 6 | 5 guides, breadcrumb |

Guides are reachable from: the nav, the footer of every page, their
department, their service, the guides index, and sibling guides. Nothing is
orphaned.

Guide relationships live in `relatedGuides` on `departments.json` and
`services.json`, so a sixth guide is one data edit from being linked
everywhere it belongs.

In-copy contextual links, 1–2 per page, never inside a heading (verified by
scanning every built page for anchors inside `h1`–`h6`: none):

- **snow** → ice-melt guide, at the first mention of concrete damage
- **fasteners** → wall anchor guide, at "the anchor is doing the work";
  key types guide, at "ordinary house, office and padlock keys"
- **paint** → colour matching service, at "bring a flat sample";
  painting prep guide, at the end of the priming answer
- **tools** → wall anchor guide, where masonry fixing comes up
- **garden** → ice-melt guide, at "ice melt and snow shovels"

---

## No-JS verification

`npm run check:nojs` is new and part of `check:all`. On **every** built page
it strips every `<script>` block — which is what a no-JS browser effectively
sees — and asserts:

1. all 8 nav destinations are present as real `<a href>` elements
2. all 9 departments are reachable
3. the `<noscript>` override block is present
4. each guide renders over 1,000 words (measured 1,059–1,193)

All pass. The mechanism is a `<noscript>` style block in `layout.njk` that
removes the drawer entirely below 820 px and renders the nav as a plain
stacked list with the departments panel expanded. Nothing on this site is
hidden behind script; JavaScript only ever collapses things that are
otherwise visible.

Manual steps are in `FUNCTIONALITY.md` section 5.

---

## The three judgment calls I most want you to look at

### 1. I did not build the live "Open today until 6 PM" indicator

It was explicitly allowed, and I could have made it technically safe —
`Intl.DateTimeFormat` with `timeZone: 'America/New_York'` gives the store's
local day correctly regardless of where the visitor is, so the midnight
boundary is not the problem.

**Holiday hours are.** They are still an open question
(`OPEN-CONTENT-QUESTIONS.md`, item D). A badge reading "Open today until
6 PM" on Thanksgiving morning is worse than no badge at all, and the repo
has no way to know. The utility strip shows the static hours instead.

Answer the holiday-hours question and this becomes a ten-line change.

### 2. CSS is at 54.5 KB of 55 KB

Effectively full. The next visual addition needs either a raised budget or a
consolidation pass — there is real duplication now between the mega-panel and
drawer rules, and between the several card variants, that a careful hour
could collapse. I did not do it in this pass because refactoring working
layout CSS at the end of a large change is how regressions get in.

### 3. The guides quietly doubled the site's content surface

Five pages of 650–800 words is now roughly a third of the site's total prose,
and none of it has been read by anyone at the store. It is all general
education and I have kept it conservative and checkable, but I am not a
paint chemist or a locksmith, and a few claims are the kind a professional
would sharpen: the sheen-to-durability table, the ice-melt working
temperatures, and the anchor capacity rankings.

Worth twenty minutes from Mike, particularly the key types guide — it is the
one where the store's own expertise is most likely to contradict a general
account, and the one most likely to be read by someone about to ring up
about a car key.

---

## Still open, unchanged

From `OPEN-CONTENT-QUESTIONS.md`: step-free access at the entrance,
contractor account terms, rentals/propane/screens, holiday hours, the
delivery cut-off, the pegboard contents, and the held background-person
image. Two of the owner's reply numbers still have no match in that file.

Photo gaps also unchanged: **electrical, garden and snow have no
photography**, snow needs a winter shoot specifically, and there is still no
paint-mixing frame. The new ice-melt guide is the clearest example of the
cost — it is the one guide with no photograph at all.
