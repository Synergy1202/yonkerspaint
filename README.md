# Yonkers Paint & Hardware — website

The site for Yonkers Paint & Hardware, 65 Main Street, Yonkers NY. It is a
static site built with [Eleventy](https://www.11ty.dev/) and deployed by
uploading a folder to Hostinger. There is no database, no server code, and
nothing to keep running.

---

## Install

You need [Node.js](https://nodejs.org/) 18 or newer. Check with `node -v`.

```
npm install
```

Run this once after cloning, and again if `package.json` changes.

## Build

```
npm run build
```

This writes the finished website into a folder called `_site/`. That folder
is what gets uploaded. It is rebuilt from scratch every time, so you never
need to clean it up by hand.

The build ships only the images and fonts a page actually references, and
prints how many it left out. The full photo library stays in `images/` in
the repo; the moment a template references one of those files, the next
build includes it again.

## Preview locally

```
npm run serve
```

Then open <http://localhost:8080> in a browser. Leave it running while you
edit: pages reload automatically when you save. Press `Ctrl+C` to stop.

## Check for broken links

```
npm run build
npm run check
```

This crawls the built site and reports any link, image, or `#anchor` that
points at something which does not exist, plus any image missing its `alt`
text. **It should always report `PASS`.** If it reports `FAIL`, fix the
listed items before deploying — each line names the page and the bad
reference.

## Deploy

1. Run `npm run build`.
2. Open Hostinger's **File Manager** (or connect over FTP).
3. Go into the `public_html` folder.
4. Upload **the contents of `_site/`** into `public_html` — the files
   themselves, not the `_site` folder. When you are done, `public_html`
   should contain `index.html`, `images/`, `css/`, `.htaccess`, and so on
   directly.
5. Overwrite when prompted.

`.htaccess` is a hidden file. If your FTP client or the File Manager does
not show it, turn on "show hidden files" — the redirects and the 404 page
will not work without it.

---

## Where things live

| Path | What it is |
|---|---|
| `src/pages/` | One file per page. `department.njk` generates all 9 department pages. |
| `src/_includes/` | The shared shell: `layout.njk`, `header.njk`, `footer.njk`, `structured-data.njk`, `img.njk`. |
| `src/_data/` | The content that drives the templates (see below). |
| `src/css/site.css` | The entire stylesheet. |
| `src/js/site.js` | The entire script (nav, hamburger, sticky header). |
| `src/static/` | Files copied to the site root as-is: favicons, `.htaccess`. |
| `images/` | Photography. See `IMAGE-MANIFEST.md`. |
| `tools/` | Maintenance scripts (link checker, image metadata, etc.). |
| `dropbox/` | Untouched full-resolution photo masters. Not deployed, not in git. |
| `_site/` | The built site. Generated — never edit it, never commit it. |

## Making common changes

**Change the phone number, address, hours, or email**
Edit `src/_data/site.json`. It is the only place these exist; the footer,
contact page, and search-engine data all read from it. Change it once and
rebuild.

**Add or change a department**
Add an entry to `src/_data/departments.json` (slug, name, blurb, anchor,
url, image keys) and a matching content file in `src/_data/deptdetail/`.
That one entry drives the nav dropdown, the homepage grid, the departments
overview, and the detail page. Leave `images` as `[]` if there are no
photos yet — the page renders text-only rather than showing a broken image.

**Add or change an FAQ, or a customer review**
Edit `src/_data/faqs.json` or `src/_data/reviews.json`.

**Add a new photo**
Put the optimized `.webp` in `images/`, add a row to `IMAGE-MANIFEST.md`
(including alt text), then run `node tools/build-imagemeta.js`. Templates
pick up the width, height, and alt text automatically.

**Add a whole new page**
Create `src/pages/yourpage.njk` with front matter for `title` and
`description`. It gets the shared shell automatically and is published at
`/yourpage.html`.

---

## Design system

The visual refresh replaced Arial and the ad hoc values with a token system.
Everything lives at the top of `src/css/site.css`; nothing outside that block
carries a raw colour or font size.

**Fonts** — self-hosted in `fonts/`, latin subset, no CDN. 53.7 KB total.

| File | Role | Size |
|---|---|---|
| `barlow-condensed-600-latin.woff2` | Headings (condensed, industrial) | 21.8 KB |
| `source-sans-3-400-latin.woff2` | Body | 15.3 KB |
| `source-sans-3-600-latin.woff2` | Body semibold, UI | 15.3 KB |

The first two are preloaded. Glyphs outside the latin subset (star glyphs,
the nav caret, the hamburger, the About emoji) fall back to a system face by
design.

**Type scale** — 1.25 ratio, `--step-0` to `--step-5`, clamped on the top
three. **Spacing** — `--space-1` to `--space-9` on an 8px base.

| Token | Value | Used for |
|---|---|---|
| `--primary` | `#0054a6` | Header, nav, headings |
| `--primary-dark` | `#003d7a` | Gradients, hovers |
| `--primary-tint` | `#e8f0f8` | Pale panels, chips |
| `--secondary` | `#c41218` | Primary buttons, phone |
| `--secondary-dark` | `#9d0e13` | Button hover, review stars |
| `--neutral-900` | `#15181c` | Footer |
| `--neutral-600` | `#5c6670` | Muted text, field borders |
| `--neutral-300` | `#c7ced5` | Text on dark |
| `--neutral-200` | `#e0e5e9` | Hairlines |
| `--text` / `--surface` / `--surface-alt` | `#1d2328` / `#ffffff` / `#f5f7f9` | Semantic aliases |
| `--radius` | `6px` | All corners (was six values) |
| `--shadow-1` / `--shadow-2` | — | All elevation (was six values) |

## Verification

Four checks, all wired to npm or a single node call. Each has been
fault-injected to confirm it fails when it should.

```
npm run build      # Eleventy -> _site/
npm run check      # broken links, missing assets, bad anchors, missing alt
node tools/css-lint.js    # raw hex / raw font-size / motion outside the
                          # reduced-motion block / stylesheet size budget
node tools/contrast.js    # 28 real fg/bg pairs against WCAG AA
node tools/page-weights.js
node tools/hero-scrim.js  # measures whether the hero scrim is needed
```

`tools/refs.js` is the shared reference collector: both the crawl and the
build's prune step use it, so they cannot disagree about what counts as
referenced.

`tools/build-derivatives.js` regenerates the display-sized image variants
(`images/card/` 480w, `images/wide/` 800w) for exactly the keys the data says
are rendered at those sizes. Run it after adding photography, then
`tools/build-imagemeta.js`.

---

## Intentional deviations from the old site

The Eleventy port kept the old look; the visual refresh that followed
deliberately changed it. Both sets of decisions are listed here. Everything
in the first table is marked `DEVIATION:` in `src/css/site.css`.

### Carried over from the port (parity fixes)

| # | Deviation | Why |
|---|---|---|
| 1 | Sticky header on every page | Was sticky on 3 of 20 pages, static on 17. |
| 2 | One button padding | Was `.75rem 1.6rem` on 4 pages and `.6rem 1.2rem`/`.6rem 1.25rem` on the rest. Now `--space-3 --space-5`. |
| 3 | One `.hero` class (+ `.hero--flat`) | Replaces 12 near-identical per-page hero classes. |
| 4 | Global `:focus-visible` outline | The old site had no focus style anywhere, and strips link underlines. |
| 5 | Skip link on every page | There was none. |
| 6 | Department striping via `.dept--flip` | Was `:nth-child(even)`, so inserting a section flipped every one below it. |
| 7 | Homepage card stagger covers 9 cards | Was hard-coded to 8 for a 9-card grid. |
| 8 | Mobile in-page nav survives | Department pages hid the sidebar entirely below 820px. |
| 9 | Review stars recoloured, plus a text label | Old `#ffb400` was 1.78:1 on white, failing at any size; the rating was also colour-only. Now `--secondary-dark`, 8.38:1. |
| 10 | Department section headings `h3` → `h2` | They sat under a sidebar-only `h2`, skipping a level. |
| 11 | Homepage hero uses a real store photo | The old hero was an AI-generated placeholder. |
| 12 | The 21 unused AI-placeholder PNGs are not deployed | Nothing references them; they were 45 MB of the old upload. |
| 13 | Both maps use the plain address-query embed | The old `pb=` strings contained synthetic placeholder segments. |
| 14 | `prefers-reduced-motion` support | The site animates on load; there was no opt-out. |

### Introduced by the visual refresh

| # | Change | Why |
|---|---|---|
| 15 | Arial retired for Barlow Condensed + Source Sans 3 | The brief: established and utilitarian, not big-box sterile. Self-hosted, so still zero third-party requests. |
| 16 | 6-step type scale, 9-step 8px spacing scale | Replaced 20 ad hoc font sizes and 25 ad hoc spacing values. |
| 17 | `--secondary` `#ea1c24` → `#c41218` | Closes audit issue 17. The old red was 4.48:1 on white and failed AA for normal text; the new one is 6.09:1. |
| 18 | Radii collapse to `6px`, shadows to two tokens | Was one radius plus a stray `2px`, and six unrelated shadow values. |
| 19 | Hero content sits over the right-hand soft-focus region above 64rem | The photograph's own blur is the text bed. Below that it centres. |
| 20 | Hero scrim lightened to a measured 0.50–0.58 | `tools/hero-scrim.js` shows white over the raw photo is 3.23:1 in the text bed and 1.45:1 at the brightest tile. 0.50 is the lightest value clearing 4.5:1 everywhere. |
| 21 | Departments without photography get a designed flat panel | Brand blue with the name set oversized in the condensed face — a treatment, not a gap. Applies to electrical, garden/seasonal and snow. |
| 22 | Mobile department nav is a sticky chip row | Resolves audit issue 37. Solved in CSS; no new JavaScript. |
| 23 | Current nav item is visible | `aria-current` was already computed by the template but nothing rendered it. |
| 24 | Image derivatives at 480w and 800w | The grid was loading 1600px images into 176px boxes. Homepage went 1799 KB → 610 KB. |
| 25 | Department overview CTAs are outline blue, not solid red | Nine stacked solid-red buttons read as nine primary actions. Red is now reserved for calling. |
| 26 | Review stars, nav caret and hamburger are inline SVG | Those code points sit outside the self-hosted latin subset, so they were rendering in whatever system face the browser fell back to. Emoji are deliberately left as characters. |
| 27 | Star ratings carry a text alternative | Closes audit issue 25: the rating was previously conveyed by glyph colour alone. Screen readers now hear "Rated 5 out of 5". |

## Two things that need a human decision

**1. The contact form is not live yet.**
`src/_data/site.json` points the form at
`https://formsubmit.co/service@yonkerspaintandhardware.com`. FormSubmit
requires a **one-time activation**: submit the form once on the live site,
then open the confirmation email sent to that address and click the link.
Until that happens, submissions are not delivered. (The old form pointed at
`your@email.com`, an untouched placeholder, so no enquiry ever arrived.)

**2. The star rating was removed from the search-engine data.**
The old `reviews.html` claimed `4.9` stars from `143` reviews in its
structured data, while showing six testimonials. That figure had no
verifiable source on the page, so it is **not** in the new markup — publishing
it risks a Google manual action. The six testimonials remain visible. If
there is a real, sourced rating (for example from the Google Business
Profile), it can be added back to `structured-data.njk`.

**Also worth verifying:** `site.json` carries the store's coordinates as
`40.93465, -73.90033`, taken from the map embed. The old structured data
claimed `-73.89814` — about 180 m east. Check which is right against the
Google Business Profile.

---

## Page weights

First-visit transfer size, HTML plus every asset the page references.
Run `node tools/page-weights.js` to regenerate.

| Page | Total |
|---|---|
| fasteners.html | 1,128 KB |
| cleaning.html | 837 KB |
| paint.html | 780 KB |
| tools.html | 743 KB |
| plumbing.html | 712 KB |
| departments.html | 681 KB |
| index.html | 610 KB |
| about.html | 519 KB |
| contact.html | 433 KB |
| roofing.html | 371 KB |
| services.html | 346 KB |
| reviews.html | 212 KB |
| faq.html | 211 KB |
| electrical.html | 207 KB |
| garden.html | 207 KB |
| snow.html | 206 KB |
| thanks.html | 203 KB |
| 404.html | 203 KB |

The old site's homepage alone was 21.8 MB. It is now 610 KB,
against a 1.2 MB budget, and the heaviest page on the site is 1,128 KB.
The whole upload is 4.7 MB.

Image-heavy pages could still gain from `srcset`, which the derivative
pipeline in `tools/build-derivatives.js` already has the sizes for.
