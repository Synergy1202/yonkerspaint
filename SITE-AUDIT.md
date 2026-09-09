# Yonkers Paint & Hardware — Site Audit

**Date:** 2026-08-30
**Scope:** Read-only audit of the static site source at repo root. No files were modified; the only files created are `SITE-AUDIT.md` and `CLAUDE.md`.
**Note on verification:** this directory is **not a git repository** (`git status` → `fatal: not a git repository`), so the "git status shows only two new files" check cannot be run. A directory listing before and after confirms these two files are the only additions.

---

## 1. Project map

```
yonkerspaint/
├── 404.html          ├── faq.html        ├── products.html
├── about.html        ├── fasteners.html  ├── reviews.html
├── brands.html       ├── garden.html     ├── roofing.html
├── cleaning.html     ├── index.html      ├── services.html
├── contact.html      ├── paint.html      ├── snow.html
├── deals.html        ├── plumbing.html   ├── tools.html
├── departments.html  ├── electrical.html
├── default.php       (leftover — see below)
└── images/           (24 PNG files, 45.0 MB total)
```

**Everything is hand-written static HTML.** There is:

- **No tooling of any kind** — no `package.json`, no build script, no bundler config, no lockfile, no `.gitignore`, no CI, no dotfiles at all (`find . -name ".*"` returns only `.`).
- **No external stylesheets** — zero `.css` files. Every page carries its own `<style>` block in `<head>`.
- **No external scripts** — zero `.js` files, and `grep '<script[^>]*src='` across all pages returns nothing. No libraries, no framework, no jQuery, no analytics.
- **No includes/partials mechanism.** Header, nav and footer are copy-pasted into all 20 pages.
- **No `sitemap.xml`, no `robots.txt`, no favicon file, no `.htaccess`.**

**Unused / leftover:**

| Item | Evidence |
|---|---|
| `default.php` (16 KB) | Hostinger's stock "Default page" placeholder. Contains zero `<?php` tags, loads Google Fonts DM Sans and a Hostinger favicon (`default.php:5`, `default.php:11-12`). Nothing links to it. It is the only hint that hosting is **Hostinger shared hosting with PHP available** — worth knowing for the redesign, but the file itself is dead. |
| `images/heroindex.png` (1.04 MB) | Referenced by no page. Superseded by `heroindex1.png`. |
| `images/services-hero.png` (3.34 MB) | Referenced **only** as `url('public/images/services-hero.png')` (`services.html:53`) — a path that does not exist, so the file is effectively orphaned. |
| ~100 image paths | Referenced by HTML/CSS but absent from disk (see §6). |
| Dead CSS/JS in `index.html` | `.has-sub`, `.sub-menu`, `.service-list` rules and the submenu JS loop (`index.html:54-68`, `index.html:459-467`) have no matching markup — `index.html`'s nav is flat. |
| `index.html:104-114` | `.services-strip` / `.cta-locksmith` defined, then fully redefined at `index.html:174-241`. First block is dead. |

---

## 2. Page inventory

| Page | Purpose | Nav family | `<main>`? |
|---|---|---|---|
| `index.html` | Homepage: hero, 9-tile department grid, services strip, Safeguard locksmith CTA, map | B (flat) | ✗ |
| `departments.html` | Canonical department landing page, 9 alternating sections with anchors | B (flat) | ✓ |
| `services.html` | 5 service cards + `<details>` FAQ strip | B (flat) | ✗ |
| `about.html` | Store story, "why choose us", promise, call CTA | A (products) | ✓ |
| `contact.html` | Address, map, **contact form** | A (products) | ✗ |
| `products.html` | **Second, competing** department page: 8 sections, 25 priced product cards | A (products) | ✗ |
| `paint` `plumbing` `electrical` `tools` `fasteners` `garden` `cleaning` `roofing` `.html` | Per-department detail pages: sticky sidebar + 5–6 `.dept-section` blocks | C (dropdown) | ✓ |
| `snow.html` | Ice-melt / snow landing page, 4 cards | B (flat) | ✓ |
| `faq.html` | 6 groups of native `<details>` Q&A (14 total) | C (dropdown) | ✓ |
| `reviews.html` | 6 testimonial cards + `AggregateRating` JSON-LD | A (+faq) | ✗ |
| `brands.html` | 8 brand logo tiles | A (+reviews/faq) | ✗ |
| `deals.html` | 5 monthly specials | A (+reviews/faq) | ✗ |
| `404.html` | Not-found page, `noindex` | A (+reviews/faq) | ✗ |

### Header / nav / footer are copy-pasted, and they have drifted badly

Hashing the extracted `<header>…</header>` and `<footer>…</footer>` blocks gives **9 distinct header variants and 8 distinct footer variants across 20 pages**.

**Nav drift — three incompatible families:**

- **Family A ("products")** — `404`, `about`, `brands`, `contact`, `deals`, `products`, `reviews`. "Departments" points at `products.html`. Sub-variants: `about`/`contact`/`products` show Home·Departments·Services·About·Contact; `reviews` adds FAQ; `404`/`brands`/`deals` **drop About entirely** and add Reviews·FAQ.
- **Family B ("flat")** — `index`, `departments`, `services`, `snow`. "Departments" points at `departments.html`. (`index.html:281-287`, `departments.html:104-115`)
- **Family C ("dropdown")** — the 8 department detail pages plus `faq.html`. A `<button class="sub-toggle">` opens an 8-item dropdown of `departments.html#…` anchors. (`paint.html:12-24`)

Consequences:

- **`products.html` and `departments.html` are two live, competing versions of the same page**, each reachable only from its own nav family. `products.html` even carries `<title>Departments | Yonkers Paint &amp; Hardware</title>` (`products.html:7`) — a duplicate title with `departments.html`.
- **Broken anchor:** family C links to `departments.html#garden` (`paint.html:20` and 8 sibling pages), but the section id is `seasonal` (`departments.html:237`). The link lands at the top of the page. `index.html:322` correctly uses `#seasonal`.
- **Missing anchor:** family C's dropdown omits `#snow`, which does exist (`departments.html:219`) and is listed in the page's own `ItemList` JSON-LD.
- **Orphan pages:** `brands.html` and `deals.html` have **zero inbound links** from anywhere. `reviews.html` and `faq.html` are linked only from `404`, `brands` and `deals` — i.e. only from orphans and the error page. **None of the four is reachable by a crawler starting at `index.html`.**
- **Nav markup order differs** even inside a family: `index`/`departments`/`snow` put `<button class="nav-toggle">` *before* the `<ul>`; `paint`/`contact`/`products` put it *after*.

**Footer drift** is formatting only — the data is consistent:

- Address `65 Main Street, Yonkers, NY 10701` and phone `914-963-3525` / `tel:+19149633525` are **identical on all 20 pages**.
- Hours values are identical everywhere; only casing differs — `Mon–Fri: 8:30 AM–6 PM` on 18 pages vs `Mon–Fri  8:30 a.m.–6 p.m.` (`services.html:99-101`) and `Mon–Fri: 8:30 a.m.–6 p.m.` (`faq.html:242-244`).
- `©` line: 18 pages use `&amp;`; `about.html:104` and `contact.html:104` use a bare `&`.
- Whitespace and `&nbsp;` differences account for the rest of the hash variance (e.g. `snow.html:3-5` collapses the whole footer onto three lines).

**No meta-tag drift between shared regions** — every page has its own `<head>` and they are genuinely per-page (see §3, §7).

---

## 3. HTML quality

**Global:** every page is `<!DOCTYPE html>` + `<html lang="en">` + `<meta charset="utf-8">` + a viewport meta. No page has a favicon `<link>`. No page has a skip link.

### Heading hierarchy

| Pattern | Pages | Assessment |
|---|---|---|
| h1 → h2 → h3 | `index`, `departments`, `about`, `contact`, `services`, `faq`, `reviews`, `snow`, `products`, `deals` | Sound. |
| h1 → h2 (sidebar only) → **h3 for every content section** | all 8 department detail pages | **Broken.** The only `<h2>` is the sidebar's "Jump to" (`paint.html:43`); the six real content sections use `<h3>` (`paint.html:61,76,91,106,121,136`). Section headings should be h2. |
| h1 → h2 → 27× h3 | `products.html` | Structurally fine; 25 h3s are product names. |
| h1 → h3 (no h2) | `404.html` | Only footer h3s exist. Acceptable for a 404. |

`brands.html` shares a mild version of this; the 8 department pages share the full problem.

### Semantic elements vs generic divs

Reasonable for hand-written HTML. `<header>`, `<nav>`, `<footer>`, `<section>`, `<article>`, `<aside>`, `<address>` are all used correctly, and `aria-labelledby` ties most sections to their headings (60+ instances). Weak spots:

- **`<main>` missing on 8 of 20 pages**: `index`, `services`, `contact`, `products`, `reviews`, `brands`, `deals`, `404`. On `index.html` the whole body is a flat sequence of `<section>` plus one bare `<div class="contact-info">` (`index.html:388`).
- **`role="banner"` misused** on `404.html:77` — applied to `<section class="hero">`, which is not a banner landmark and duplicates the page's `<header>`.
- `index.html`'s service cards are `<div class="service-card">` (`index.html:334-361`) where `<article>` — as used on `services.html` — would match the rest of the site.
- `index.html:371` and `index.html:382` use inline `style` on `<p>` for layout that belongs in the stylesheet.

### Alt text

**Coverage is complete — 122 `<img>` tags, zero missing `alt` attributes.** The nine `alt=""` on `index.html:316-324` are correct: each card wraps the image and a text `<span>` in one link, so an empty alt avoids duplicate announcement. Alt copy is descriptive elsewhere ("Rows of nuts, bolts and screws drawers", `departments.html:107`). Minor drift: `snow.html:4` uses `alt="Yonkers Paint & Hardware"` where the other 19 pages use `alt="Yonkers Paint & Hardware logo"`.

**No `<img>` anywhere has `width`/`height` attributes** (0 of 122) and **none has `loading="lazy"`** — see §6 and §8.

### Inline styles and scripts

- **Inline `style=` attributes:** 2–4 per page, 51 total. Nearly all are the same three: `style="color:#fff;font-weight:600"` on the footer phone link, `style="color:#fff"` on the Instagram link, `style="display:none"` on the form honeypot. Plus two layout ones on `index.html:371,382`.
- **Inline `onclick`:** 7 pages (`404:71`, `about:121`, `brands:85`, `contact:122`, `deals:87`, `products:101`, `reviews:117`) drive the hamburger from a two-statement `onclick` attribute instead of a listener. The other 13 pages use `addEventListener`.
- **Every page's CSS is an inline `<style>` block** (42–249 lines each; `index.html:19-268` is the largest).
- **Every page's JS is an inline `<script>` block** at the end of `<body>`.

### `<head>` contents

| | title | description | canonical | OG | Twitter | favicon | JSON-LD |
|---|---|---|---|---|---|---|---|
| `index` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | **✗** |
| `departments` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ItemList |
| `services` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Store |
| `about` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | HardwareStore |
| `contact` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | HardwareStore |
| `products` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| `reviews` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | HardwareStore + AggregateRating |
| `brands` / `deals` / `faq` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| `snow` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Store |
| 8 department pages | ✓ | ✓ | **✗** | **✗** | **✗** | ✗ | ✗ |
| `404` | ✓ | **✗** | ✗ (correct) | ✗ | ✗ | ✗ | ✗ (`noindex`, `404.html:8`) |

**`og:image` is broken on 10 pages** — `about`, `brands`, `contact`, `deals`, `faq`, `products`, `reviews` point at `images/hero/hero.jpg`; `services` at `images/hero/services-hero.jpg`; `snow` at `images/hero/snow-hero.jpg`. None exists. Only `index` and `departments` (`images/heroindex1.png`) resolve — and even those are relative URLs where OG requires absolute.

---

## 4. CSS

### Stylesheets and load order

There are none. **20 inline `<style>` blocks, one per page, each self-contained.** Order within a page is: `:root` tokens → reset → base → header/nav → hero → page-specific → responsive → footer. There is no cascade *between* pages, so any shared change must be repeated 20 times.

| Page | `<style>` lines | Page total |
|---|---|---|
| `index.html` | 249 (`19-268`) | 472 |
| `electrical.html` | 87 | 310 |
| `paint.html` | 83 | 308 |
| `cleaning`/`fasteners`/`garden`/`plumbing`/`roofing`/`tools` | 81–82 | 280–303 |
| `departments.html` | 76 | 354 |
| `services.html` | 74 | 270 |
| `faq`/`about`/`contact`/`products` | 55–61 | 203–284 |
| `snow`/`reviews`/`deals`/`brands`/`404` | 42–53 | 118–211 |

Total HTML+CSS+JS on disk: **226 KB across 20 pages**, roughly 60% of it duplicated boilerplate.

### Organization and naming

Flat, semantic, hyphenated class names — `.site-header`, `.top-nav`, `.nav-toggle`, `.sub-menu`, `.has-sub`, `.hero`, `.page-hero`, `.hero-sm`, `.hero-paint`, `.btn`, `.btn-primary`, `.btn-light`, `.card`, `.grid`, `.card-grid`, `.service-card`, `.dept-section`, `.section-content`, `.callout`, `.sidebar`, `.jump-links`, `.wrapper`, `.site-footer`, `.footer-grid`, `.copyright`, `.hours`. No BEM, no utilities, no nesting. Comments serve as consistent section dividers (`/* ── Header ───── */`).

**The naming is a genuine asset** — coherent and predictable across all 20 files, which is what makes extraction to a shared stylesheet tractable.

**Naming inconsistency to resolve:** the hero class differs on almost every page — `.hero` (index, 404, brands, deals, faq, reviews, snow), `.page-hero` (services, about, contact, products), `.hero-sm` (departments), `.hero-paint` / `.hero-tools` / `.hero-plumbing` etc. (one per department page). All do the same job.

### Duplication

- Header/nav/footer/reset/token rules — roughly 35–40 lines — are byte-similar in all 20 files.
- `index.html:104-114` is **fully dead**, overridden by `index.html:174-241`.
- `.btn` is redefined per page with different padding: `.75rem 1.6rem` (`index.html:83`) vs `.6rem 1.2rem` (`paint.html:68`).
- `.site-header` is `position:sticky` on `index.html:40`, `departments.html` and `services.html`, but **static** on the 8 department pages (`paint.html:26`) — inconsistent behaviour between pages.

*(A duplicate-selector scan also flags `.top-nav ul`, `.nav-toggle`, `.sidebar` and `section.department` on many pages. Those are base rules plus a media-query override — expected, not a defect.)*

### Specificity hotspots

Specificity is very low overall (mostly single classes), which is good. The hotspots:

- `section.department` and `section.department:nth-child(even)` (`departments.html:63,65`) — element+class, and `:nth-child(even)` drives the alternating layout, so inserting any element into `<main>` silently flips every stripe below it.
- `.card:nth-child(1)` … `:nth-child(8)` animation-delay stagger (`index.html:94-97`) — hard-coded to 8 cards, but the grid has 9 (`index.html:316-324`), so the ninth animates with no delay.
- `@media(hover:hover){.has-sub:hover > .sub-menu, .has-sub:focus-within > .sub-menu}` (`index.html:65-68`) vs `@media (hover:hover){.has-sub:hover .sub-menu}` (`paint.html:39`) — the department pages dropped `:focus-within`, which is the keyboard bug in §8.
- Inline `style=` attributes on footer links beat any stylesheet rule (51 instances), and the mobile submenu JS writes `element.style.display` directly (`paint.html:207`), outranking the CSS with no reset on resize.

### Responsive strategy

- **Breakpoints:** `820px` (nav → hamburger, all 20 pages), `860px` (department detail `.wrapper` collapses to one column, 8 pages), `880px` (`departments.html` `section.department` collapses). Fluid grids elsewhere via `repeat(auto-fit, minmax(…, 1fr))` and `clamp()` headings — the layout is genuinely fluid between breakpoints.
- **Mobile nav behaviour:** below 820px the `<ul>` is `display:none`, the `☰` button appears, and clicking toggles `.open` on `#mainNav` to reveal a stacked column. On family C the `<button class="sub-toggle">` additionally sets `nextElementSibling.style.display` inline.
- **`.sidebar{display:none}`** below 820px (`paint.html:84`) — the department pages' "Jump to" navigation vanishes entirely on mobile with no replacement.

### De facto design tokens

Declared identically in `:root` on **all 20 pages** (values verified identical; only whitespace differs):

| Token | Value | Role |
|---|---|---|
| `--primary` | `#0054a6` | Header, nav, footer h3, section headings, callouts, sidebar links |
| `--secondary` | `#ea1c24` | Primary buttons, phone number, hover accents |
| `--dark` | `#222` | Body text |
| `--light` | `#f8f8f8` | Page background, jump-link chips |
| `--max` | `1200px` | Content max-width |
| `--radius` | `4px` | Every corner (65 of 68 `border-radius` uses reference it) |

Colours used but **not** tokenised:

| Hex | Uses | Where |
|---|---|---|
| `#fff` | 207 | Text on dark, card backgrounds |
| `#ddd` | 29 | Card / sidebar borders |
| `#ccc` | 21 | Footer body text |
| `#999` | 20 | `.copyright` |
| `#111` | 20 | Footer background |
| `#c41218` | 13 | `.btn:hover` (darkened red) |
| `#003d7a` | 1 | `.services-strip` gradient end (`index.html:175`) |
| `#b11017` | 1 | `.cta-locksmith` gradient end (`index.html:215`) |
| `#e8e8e8` `#f7f7f7` `#f2f2f2` | 4 | Light-button hovers — three near-identical values |
| `#ffb400` | 1 | Review stars (`reviews.html:53`) |
| `#666` | 1 | Review meta text (`reviews.html:56`) |
| `rgba(255,255,255,.2/.18/.15/.1)` | 32 | Nav hover, translucent card fills |
| `rgba(0,0,0,.5/.45/.35/.25/.12/.1/.05)` | 30 | Hero overlays, text shadows, box shadows |

| Category | Values in use |
|---|---|
| **Font family** | `Arial, Helvetica, sans-serif` — the only stack, all 20 pages. No web font is loaded anywhere. |
| **Line height** | `1.6` body; `1.4` `<address>` |
| **Font sizes** | `.72 .8 .85 .9 .95 .96 1 1.05 1.1 1.15 1.2 1.25 1.3 1.35 1.4 1.5 1.6 1.75 1.9 2` rem — **20 discrete sizes, no scale** |
| **Fluid headings** | `clamp(1.8rem,4vw,2.4rem)`, `clamp(1.8rem,4vw,2.5rem)`, `clamp(1.8rem,4vw,2.6rem)`, `clamp(1.9rem,4vw,2.5rem)`, `clamp(2rem,5vw,2.8rem)`, `clamp(2.2rem,5vw,3rem)` — **6 near-identical variants** |
| **Font weights** | `500`, `600`, `700`/`bold` |
| **Spacing** | `.25 .35 .4 .45 .5 .6 .75 .8 .9 1 1.2 1.25 1.4 1.6 1.75 1.8 2 2.5 2.6 2.8 3 3.2 3.5 4 5` rem — ad hoc, no 4pt/8pt grid |
| **Radii** | `var(--radius)` = `4px` (65 uses); `2px` (2 uses) |
| **Shadows** | `0 3px 6px rgba(0,0,0,.25)` (sticky header) · `0 8px 14px rgba(0,0,0,.25)` (service-card hover) · `0 4px 8px rgba(0,0,0,.12)` (card hover) · `0 3px 6px rgba(0,0,0,.1)` · `0 2px 6px rgba(0,0,0,.1)` · `0 2px 4px rgba(0,0,0,.05)` — **6 unrelated values** |
| **Text shadows** | `0 2px 5px rgba(0,0,0,.5)` · `0 2px 4px rgba(0,0,0,.45)` · `0 2px 4px rgba(0,0,0,.25)` |
| **Transitions** | `.2s`, `.25s`, `transform .25s, box-shadow .25s` |
| **Animations** | `fadeUp .8s ease-out`, `zoomIn .6s cubic-bezier(.3,.7,.2,1)` — defined only in `index.html:35-36` |
| **Containers** | `var(--max)` = `1200px`; `1000px` for `.service-cards`; `620px`/`680px`/`700px` for prose |
| **Grid minimums** | `minmax(150px,1fr)`, `minmax(200px,1fr)`, `minmax(220px,1fr)`, `minmax(300px,1fr)` |

### Rules that appear unused (best effort)

Method: cross-referenced every `.class` selector in each page's `<style>` against the `class=` attributes in that page's `<body>`. False positives excluded (`.open` / `.scrolled` are applied by JS; `.jpg` / `.png` / `.org` / `.w3` are fragments of URLs and namespace strings inside `url()`):

- **`index.html`: `.has-sub`, `.sub-menu`, `.service-list`** — genuinely dead. `index.html`'s nav is flat (`index.html:281-287`), so the caret rule (`:54`), the dropdown rules (`:57-68`), the mobile `[aria-expanded]` rule (`:141`) and the matching JS loop (`:459-467`) never fire.
- **`index.html:104-114`** — the first `.services-strip` / `.cta-locksmith` definitions, fully overridden 70 lines later.
- Everything else resolves to live markup on its own page.

---

## 5. JavaScript

**No external scripts, no libraries, no versions to track, no globals leaked.** Every page has one inline `<script>` at the end of `<body>` (plus, on six pages, a separate `application/ld+json` block, which is data rather than code). All executable code lives inside `document.addEventListener('DOMContentLoaded', …)` with `const` locals — nothing is attached to `window`.

Four variants exist:

| Variant | Pages | Contents |
|---|---|---|
| **Year only** | `404.html:111`, `contact.html:216` | Sets `#year` textContent |
| **Year + burger** | `snow.html:169`; `about`, `brands`, `deals`, `products`, `reviews` (via inline `onclick` rather than a listener) | Toggles `.open` on `#mainNav`, flips `aria-expanded` |
| **Year + sticky-header shadow + burger** | `index.html:434`, `departments.html:314`, `services.html:223` | Adds a `scroll` listener toggling `.scrolled` on `#header` (`{passive:true}` — correct) |
| **Year + burger + mobile submenu** | the 8 department pages + `faq.html:257` | Adds a `.sub-toggle` click handler gated on `window.innerWidth > 820` |

**What each does:**

1. **Copyright year** — `document.getElementById('year').textContent = new Date().getFullYear()`, guarded with `if(y)`. Present on all 20 pages.
2. **Sticky-header shadow** — `header.classList.toggle('scrolled', window.scrollY > 10)` on scroll.
3. **Hamburger** — reads `aria-expanded`, writes the negation, toggles `.open`.
4. **Mobile submenu** — writes `subBtn.nextElementSibling.style.display = exp ? 'none' : 'flex'`.

### Fragile or dead

- **Dead on `index.html`:** `nav.querySelectorAll('.has-sub > a')` (`index.html:459`) matches zero elements — `index.html`'s nav has no `.has-sub`. The whole submenu block, and the `.has-sub` collapse loop inside the burger handler (`index.html:453-455`), are inert.
- **Unguarded `querySelector`:** `document.getElementById('header')` (`index.html:442`) is used with no null check inside the scroll listener; `nav.querySelector('.nav-toggle')` and `nav.querySelector('.sub-toggle')` (`paint.html:193,201`) likewise. Each is satisfied on its own page today, but because it all shares one `DOMContentLoaded` handler, copy-pasting a script into a page that lacks the element throws and takes the year stamp down with it.
- **Inline-style leak across the breakpoint:** the submenu handler sets `style.display` directly (`paint.html:207`). An inline style outranks `.sub-menu{display:none}` and is never cleared, so opening the submenu on a phone and then widening past 820px leaves the dropdown permanently expanded. There is no `resize` handler anywhere.
- **`aria-expanded` set to a boolean:** `burger.setAttribute('aria-expanded', !open)` (`index.html:450`). It works — `setAttribute` stringifies — but it is easy to break.
- **`aria-label="Open menu"` never updates** to "Close menu" while the nav is open (all 20 pages).
- **Two implementations of one behaviour** — `onclick` attribute on 7 pages, `addEventListener` on 13. The `onclick` version (`contact.html:122-124`) also omits the submenu-collapse and shadow logic.
- **No Escape-to-close, no outside-click dismissal, no focus management, no `aria-controls`** on any hamburger.

---

## 6. Assets and third parties

### Images

All 24 files are **PNG**, including full-bleed photographs that should be JPEG/WebP/AVIF. **`images/` totals 45.0 MB.**

| File | Dimensions | Size | Displayed at | Verdict |
|---|---|---|---|---|
| `category-roofing.png` | 1024×1536 | **2.87 MB** | 110px-tall card | grossly oversized |
| `category-fasteners.png` | 1536×1024 | **2.52 MB** | 110px-tall card | grossly oversized |
| `category-tools.png` | 1536×1024 | **2.45 MB** | 110px-tall card | grossly oversized |
| `category-cleaning.png` | 1536×1024 | **2.15 MB** | 110px-tall card | grossly oversized |
| `category-electrical.png` | 1024×1024 | **2.02 MB** | 110px-tall card | grossly oversized |
| `category-paint.png` | 1024×1024 | **1.85 MB** | 110px-tall card | grossly oversized |
| `category-garden.png` | 1024×1024 | **1.81 MB** | 110px-tall card | grossly oversized |
| `category-snow.png` | 1024×1024 | **1.78 MB** | 110px-tall card | grossly oversized |
| `category-plumbing.png` | 1024×1024 | **1.65 MB** | 110px-tall card | grossly oversized |
| `department-garden.png` | 1536×1024 | **2.79 MB** | 330px column | grossly oversized |
| `department-tools.png` | 1536×1024 | **2.41 MB** | 330px column | grossly oversized |
| `department-snow.png` | 1024×1536 | **2.37 MB** | 330px column | grossly oversized |
| `department-cleaning.png` | 1536×1024 | **2.17 MB** | 330px column | grossly oversized |
| `department-electrical.png` | 1024×1024 | **1.98 MB** | 330px column | grossly oversized |
| `department-roofing.png` | 1024×1024 | **1.99 MB** | 330px column | grossly oversized |
| `department-fasteners.png` | 1024×1024 | **1.88 MB** | 330px column | grossly oversized |
| `department-paint.png` | 1024×1024 | **1.66 MB** | 330px column | grossly oversized |
| `department-plumbing.png` | 1024×1024 | **1.55 MB** | 330px column | grossly oversized |
| `services-hero.png` | 1536×1024 | **3.34 MB** | — | oversized **and unreachable** (`public/` prefix) |
| `heroindex1.png` | 1536×1024 | **2.48 MB** | full-bleed hero | oversized for a background |
| `heroindex.png` | 1024×1024 | **1.04 MB** | — | **unused** |
| `logo3.png` | 621×402 | 124 KB | `max-width:220px` | ~3× oversized |
| `yonkerslogo.png` | 500×500 | 90 KB | 46–48px tall | **~10× oversized**, loaded on all 20 pages |
| `benjamin-moore.png` | 320×320 | 9 KB | 56px tall | ~6× oversized but small enough |

**23 of 24 files exceed 300 KB.** Computed page payloads:

- **`index.html` ships ~21.8 MB of images** (hero background + 9 category tiles + 3 logos).
- **`departments.html` ships ~21.4 MB.**

No `<img>` has `width`/`height` (guaranteed layout shift) and none has `loading="lazy"` (0 of 122). Only the two Google Maps `<iframe>`s are lazy (`index.html:400`, `contact.html:37`).

### Missing image files — the largest defect on the site

Roughly **100 referenced image paths do not exist on disk.** Whole directories are absent: `images/hero/`, `images/brands/`, `images/departments/`, `images/paint/`, `images/tools/`, `images/plumbing/`, `images/electrical/`, `images/fasteners/`, `images/garden/`, `images/cleaning/`, `images/roofing/`, `images/deals/`, plus `images/key-pattern.png` (`index.html:225`).

**18 of 20 pages have a broken hero background.** Only `index.html` (`images/heroindex1.png`) and `departments.html` (solid `--primary`, `departments.html:51`) render. `services.html:53` points at `public/images/services-hero.png` — the file exists at `images/services-hero.png`, but the `public/` prefix does not.

Fully broken content images:

- All 8 department detail pages — every `.dept-section` image (48 total, e.g. `paint.html:59,74,89,104,119,134`).
- `products.html` — all 25 product photos (`products.html:35` onward).
- `brands.html` — all 8 brand logos (`brands.html:28-35`).
- `deals.html` — all 5 deal photos.

### Third parties

| Dependency | Where | How |
|---|---|---|
| **Google Maps embed** | `index.html:400-402`, `contact.html:37-40` | `<iframe>` with `loading="lazy"`, `title`, `referrerpolicy="no-referrer-when-downgrade"`. **The `pb=` parameter looks synthetic** — it contains placeholder segments `0x89c2e603e9555555%3A0x123456789abcdef` and `4v0000000000000`, i.e. a hand-edited place ID and timestamp rather than a string copied from Google. |
| **Instagram** | 20 footers | Plain `<a>` to `instagram.com/yonkerspaintandhardware/` with `target="_blank" rel="noopener"`. **No embed, no script.** |
| **FormSubmit.co** | `contact.html:153` | Contact-form endpoint (below). |
| **safeguardlock.net** | `index.html:377` | Partner link, `target="_blank" rel="noopener"`. |
| **Google Fonts (DM Sans)** | `default.php:10-12` | Only in the dead Hostinger placeholder. |
| **Fonts** | — | **None.** System `Arial, Helvetica, sans-serif` everywhere. |
| **Analytics / tag manager / cookie banner / consent** | — | **None. Zero tracking on the site.** |

`schema.org` and `www.w3.org` also appear in a host scan, but those are namespace strings inside JSON-LD and SVG, not network requests.

### Contact form

The only form on the site is `contact.html:153-184`. It POSTs to **FormSubmit.co**, a third-party form-to-email relay:

```html
<form action="https://formsubmit.co/your@email.com" method="POST">
  <input type="hidden" name="_honey"   style="display:none">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_next"    value="https://yonkerspaintandhardware.com/thanks.html">
```

Three blocking problems:

1. **The endpoint is the untouched placeholder `your@email.com`** (`contact.html:153`). Submissions do not reach the store. The real address, `service@yonkerspaintandhardware.com`, appears elsewhere on the same page (`contact.html:34`).
2. **`_next` redirects to `thanks.html`, which does not exist** in the repo (`contact.html:161`) — a successful submit would land on a 404.
3. **`_captcha` is disabled** (`contact.html:159`), leaving only the `_honey` honeypot against spam.

The fields are otherwise well built: every `<input>`/`<textarea>` has a matching `<label for>`, `required` is set on name/email/message, and `type="email"`/`type="tel"` are correct.

---

## 7. SEO and local business

### Titles and descriptions

Every page except `404.html` has both a unique `<title>` and a hand-written `<meta name="description">`, and the descriptions are genuinely good — specific, brand-rich, local. Two issues:

- **Duplicate title:** `products.html:7` and `departments.html:5` are both "Departments | Yonkers Paint & Hardware" (the latter with a suffix). Two indexable pages competing for one query.
- **`404.html` has no description** — correct, given `<meta name="robots" content="noindex">` (`404.html:8`).

### Structured data

| Page | Type | Notes |
|---|---|---|
| `about.html:84` | `HardwareStore` | Name, phone, full `PostalAddress`, `foundingDate: 1966`, `url`, `sameAs` Instagram. `image` → broken `images/hero/hero.jpg`. |
| `contact.html:82` | `HardwareStore` | As above plus `email` and `geo`. **`geo.longitude` is `-73.89814`, but the Maps iframe on the same page uses `-73.90033`** — a ~180 m discrepancy to resolve against the real location. `image` broken. |
| `reviews.html:75` | `HardwareStore` + `AggregateRating` | `ratingValue 4.9`, `reviewCount 143`, two reviews. **Missing `address` and `url`, so the rating is not tied to the business entity.** `author` is a bare string, not a `Person`. Google requires aggregate ratings to reflect verifiable, on-page reviews — the page shows 6 testimonials, not 143. Flagged as an open question, not a fix. |
| `services.html:244` | `Store` | `makesOffer` with 6 services. `image` → `/public/images/yonkerslogo.png` — wrong path (`public/` does not exist). |
| `snow.html:186` | `Store` | The only page carrying **`openingHours: "Mo-Fr 08:30-18:00, Sa 10:00-17:00"`** — matches the footers. `image` broken. |
| `departments.html:335` | `ItemList` | 9 departments. Item 6 correctly uses `#seasonal`. |

**Gaps:** `index.html` — the page most likely to be the search result — **has no structured data at all**. `HardwareStore` is used on three pages and `Store` on two, describing the same business with different types and no `@id` linking them. `openingHours` appears on exactly one page. No markup carries price range or `hasMap`.

### Crawl infrastructure

- **No `sitemap.xml`.** With four pages orphaned from the internal link graph, a sitemap is currently the only way a crawler would find them.
- **No `robots.txt`.**
- **Canonicals:** present and correct on 12 pages. **Absent on all 8 department detail pages** (`paint`, `plumbing`, `electrical`, `tools`, `fasteners`, `garden`, `cleaning`, `roofing`), and correctly absent on `404.html`.
- **No favicon on any page** — no `.ico`, no `link rel="icon"`, no apple-touch-icon.
- **Orphans:** `brands.html` and `deals.html` have no inbound links; `reviews.html` and `faq.html` are reachable only from those orphans and `404.html`. None is reachable from `index.html`.
- **`deals.html:131` contains an unqualified seasonal claim** — "$8.99 per bag through August", with no year. Today is 2026-08-30; this may be several years stale.

### NAP consistency — clean

| Field | Value | Consistency |
|---|---|---|
| **Name** | Yonkers Paint & Hardware | Identical on all 20 pages (only `&` vs `&amp;` encoding varies) |
| **Address** | 65 Main Street, Yonkers, NY 10701 | **Identical on all 20 pages** — footers, `<address>` blocks, and all 5 JSON-LD blocks |
| **Phone** | 914-963-3525 / `tel:+19149633525` | **Identical on all 20 pages** (68 occurrences). `index.html:395` and `contact.html:33` display `914 - 963 - 3525` with `&nbsp;` — cosmetic; the `tel:` href is correct |
| **Email** | service@yonkerspaintandhardware.com | Consistent in 5 real uses; the two placeholders (`your@email.com`, `you@example.com`) are in the form |
| **Hours** | Mon–Fri 8:30 AM–6 PM · Sat 10 AM–5 PM · Sun Closed | **Same values on all 20 pages**; only AM/PM vs a.m./p.m. casing differs |
| **Partner phone** | Safeguard Lock & Key, 914-963-6390 | `index.html:382` only |

This is the strongest part of the site and should be the source of truth during the redesign.

---

## 8. Accessibility quick pass

### Keyboard operability of the hamburger nav

- **Below 820px the hamburger itself works.** It is a real `<button>` (`index.html:280`), so it is focusable and responds to Enter/Space, and `aria-expanded` is updated on toggle.
- **The `<ul>` it reveals is keyboard-reachable** because `.open` sets `display:flex`; hidden links are `display:none` and correctly removed from the tab order when closed.
- **On the 9 family-C pages the desktop dropdown is unreachable by keyboard.** `paint.html:39` reveals the submenu on `:hover` only. The `<button class="sub-toggle">` is focusable, but its handler returns immediately above 820px (`paint.html:203`), and unlike `index.html:67` these pages have **no `:focus-within` rule**. A keyboard user can focus "Departments", press Enter, and get nothing. (`index.html` has the correct `:focus-within` rule but no `.has-sub` markup to apply it to — the working code and the markup that needs it are on different pages.)
- **`aria-expanded` is on the wrong element in `index.html`'s mobile submenu logic** — the JS writes it to `<li class="has-sub">` (`index.html:454,465`), not to an interactive control; the matching selector `.has-sub[aria-expanded="true"]` (`index.html:141`) is dead anyway.
- **No `aria-controls`** links any hamburger to the menu it opens (0 occurrences site-wide).
- **`aria-label="Open menu"` is static** — it still says "Open menu" while the menu is open, on all 20 pages.
- **No Escape-to-close, no focus return, no outside-click dismissal, no focus trap.**
- **No skip link** on any page, so keyboard users tab through the full nav on every page.

### Focus styles

**There is not a single `:focus` or `:focus-visible` rule in the entire codebase.** The only match for "focus" anywhere is `.has-sub:focus-within` (`index.html:67`), which is a visibility rule, not a focus indicator. Every interactive element falls back to the browser default outline — and since `a{color:inherit;text-decoration:none}` strips underlines from all links (`index.html:31`), links in body copy are distinguished by nothing but position. This is the highest-value accessibility fix available.

### ARIA attributes

Good coverage where it exists: `aria-label="Primary"` on all 20 `<nav>`s, `aria-label` on section-level `<nav>`s and grids, ~60 `aria-labelledby` pairings tying sections to their headings, `aria-hidden="true"` on the three decorative SVGs (`index.html:336,346,356`), and `title` on both map iframes.

Gaps: no `aria-controls`; no `aria-current` on the active nav item (nothing indicates which page you are on, visually or programmatically); and `reviews.html:28` renders ratings as bare `★★★★★` text in a `<div class="stars">` with no accessible name — a screen reader announces five "black star" glyphs with no rating context.

`role="banner"` on `404.html:77` is applied to a `<section class="hero">`, which is invalid there and duplicates the page's `<header>` landmark.

### Contrast of the main palette

Computed WCAG 2.1 ratios for the combinations actually used:

| Combination | Ratio | AA normal | AA large |
|---|---|---|---|
| `#fff` on `--primary #0054a6` — header, nav, callouts, footer h3 | **7.45:1** | ✓ | ✓ |
| `--primary` on `#fff` — section headings, sidebar links | **7.45:1** | ✓ | ✓ |
| `--primary` on `--light #f8f8f8` — jump-link chips | **7.02:1** | ✓ | ✓ |
| `--dark #222` on `--light` — body text | **14.98:1** | ✓ | ✓ |
| `#fff` on `#111` — footer headings | **18.88:1** | ✓ | ✓ |
| `#ccc` on `#111` — footer body | **11.76:1** | ✓ | ✓ |
| `#999` on `#111` — `.copyright` | **6.63:1** | ✓ | ✓ |
| `#fff` on `#003d7a` — services gradient end | **10.78:1** | ✓ | ✓ |
| `#fff` on `#c41218` — `.btn-primary:hover` | **6.09:1** | ✓ | ✓ |
| `#fff` on `#b11017` — locksmith gradient end | **7.10:1** | ✓ | ✓ |
| `#666` on `#fff` — review meta | **5.74:1** | ✓ | ✓ |
| **`#fff` on `--secondary #ea1c24`** — every primary button | **4.48:1** | **✗** | ✓ |
| **`--secondary` on `#fff`** — `.phone` on cards | **4.48:1** | **✗** | ✓ |
| **`--secondary` on `--light`** — `.phone` on page background | **4.22:1** | **✗** | ✓ |
| **`#ffb400` on `#fff`** — review stars | **1.78:1** | **✗** | **✗** |

**The blue is excellent. The red is the problem** — it misses AA for normal text by 0.02, and it is the colour of every `.btn-primary` label (`font-weight:bold`, `1rem`/16px — below the 18.66px bold threshold that would qualify as "large") and every displayed phone number. Darkening `--secondary` toward the existing `#c41218` hover value clears AA at 6.09:1 without changing the brand look. The `#ffb400` stars fail outright and, being the sole carrier of the rating, need a text equivalent regardless.

**Unverifiable statically:** white hero text sits over photographic backgrounds behind `rgba(0,0,0,.35)` and `rgba(0,0,0,.45)` overlays (`index.html:79`, `paint.html:46`). With 18 of 20 hero images missing there is nothing to measure. Recorded as an open question.

---

## 9. Growth readiness

### What it takes to add a new department today

Adding "Windows & Screens" means touching **at least 13 files**:

1. **Create `windows.html`** — copy an existing department page (~300 lines) and edit: `<title>`, description, the ~85-line `<style>` block (including a new `.hero-windows` class and its background URL), the header/nav (13 links), the sidebar "Jump to" list, 5–6 `.dept-section` blocks, the callout, the footer (25 lines) and the ~25-line script.
2. **Add a section to `departments.html`** — a new `<section id="windows" class="department">`, a `.jump-links` chip, and an `ItemList` entry in the JSON-LD. Because the alternating layout is driven by `:nth-child(even)` (`departments.html:65`), inserting anywhere but the end silently flips the image side of every following section.
3. **Add the dropdown item to the nav on 9 pages** — the 8 existing department pages and `faq.html` each carry their own copy of the 8-item `.sub-menu` (`paint.html:14-23`).
4. **Add a card to `index.html`** — and, since this would be the 10th card, extend the hard-coded `.card:nth-child(n)` animation-delay stagger (`index.html:94-97`), which already runs out one card early.
5. **Decide whether `products.html` also needs a section** — it is the parallel department page with its own 8-item `.dept-nav` (`products.html:21`).
6. **Add images** in two sizes to `images/`.

Adding a plain page (a second location, a new service) is smaller but still means copy-pasting ~110 lines of header + footer + script + tokens, then adding the link to **three different nav variants** across up to 20 files.

### What gets copy-pasted

| Block | Copies | Lines each |
|---|---|---|
| `:root` token declaration | 20 | 8 |
| Reset + base (`*`, `body`, `a`, `img`) | 20 | 4 |
| Header / nav / burger CSS | 20 | ~15 |
| Footer CSS | 20 | ~7 |
| `@media(max-width:820px)` nav block | 20 | ~7 |
| `<header>` markup | 20 (9 variants) | 14–31 |
| `<footer>` markup | 20 (8 variants) | 25 |
| `DOMContentLoaded` script | 20 (4 variants) | 5–35 |

Roughly **60% of the 226 KB of HTML is duplicated boilerplate**, and it has already drifted into 9 header, 8 footer and 4 script variants. The drift is not hypothetical — it has happened.

### Duplication pain points, ranked

1. **Nav is the worst.** Three incompatible families mean there is no single answer to "what are the site's pages". A link added correctly to one family is invisible from the other two. This is what stranded `brands.html` and `deals.html`.
2. **Two competing department systems** (`departments.html` + 8 detail pages vs `products.html`) doubles every content edit and creates a duplicate `<title>`.
3. **The footer is the NAP record** and exists in 20 places. Hours have already fragmented into three renderings. One hours change today is 20 edits.
4. **Design tokens are declared 20 times.** They happen to be identical today — the one thing that has *not* drifted — which makes extracting them the safest possible first move.
5. **Per-page hero classes** (`.hero`, `.page-hero`, `.hero-sm`, `.hero-paint`, …) give one component 12 names.

### Constraints any future templating or build decision must respect

These are properties of the current situation, not a recommendation:

- **Hosting is Hostinger shared hosting.** The stray `default.php` establishes that PHP is available and that the deploy target serves files from the document root. There is no evidence of Node, SSH, or a CI runner. Whether deploys happen by FTP, the hPanel file manager, or some other route is **unknown** — recorded as an open question.
- **URLs are flat `.html` files at the root**, and 12 pages have `<link rel="canonical">` pointing at exactly those URLs. Any new structure must either preserve `/paint.html` etc. or ship redirects.
- **There is no git history**, so there is no rollback and no record of why the two department systems coexist. Initialising a repository is a prerequisite, not an improvement.
- **No build step exists today**, so any contributor can open a file and edit it. Whatever replaces that must not require a toolchain the store's own maintainer cannot run, unless someone else owns deploys.
- **Zero third-party JS and no cookies today.** The site has no consent banner because it needs none. Introducing analytics or an embed changes that obligation.
- **The design tokens, the class vocabulary and the NAP data are all consistent** and should be treated as the migration's source of truth. The content — copy, product lists, FAQ answers, alt text — is genuinely good and hand-written. It is the plumbing that is broken, not the material.
- **~100 missing images** mean the current pages cannot be used as a visual reference. Any "match the existing design" instruction has to be qualified: only `index.html` and `departments.html` render as intended.

---

## Issues and opportunities

Prioritised. `[quick win]` = small, isolated, low-risk. `[refresh]` = belongs in the visual refresh. `[structural]` = requires the architecture decision.

### Blocking — the site is visibly broken today

1. **~100 referenced images do not exist; 18 of 20 pages have a broken hero background.** Entire directories (`images/hero/`, `images/brands/`, `images/departments/`, and one per department) are absent. All 48 department-page section images, all 25 `products.html` product photos, all 8 `brands.html` logos and all 5 `deals.html` photos are broken. — `[structural]` (asset recovery or production must precede the refresh)
2. **The contact form goes nowhere.** `contact.html:153` still posts to `https://formsubmit.co/your@email.com`. Every enquiry submitted since launch has been lost. — `[quick win]`
3. **The form's success redirect 404s.** `_next` → `thanks.html`, which does not exist (`contact.html:161`). — `[quick win]`
4. **`services.html` hero points at `public/images/services-hero.png`** while the file sits at `images/services-hero.png` (`services.html:53`). One-word fix, restores a hero. — `[quick win]`
5. **`index.html` ships ~21.8 MB of images; `departments.html` ~21.4 MB.** 23 of 24 PNGs exceed 300 KB, several exceed 2.5 MB, and all are served 5–14× larger than displayed. On a phone this is effectively an unusable page. — `[refresh]`

### High — correctness and reach

6. **Three incompatible nav families** (`departments.html` vs `products.html` vs the 8-item dropdown) across 9 distinct header variants. — `[structural]`
7. **`brands.html` and `deals.html` have zero inbound links; `reviews.html` and `faq.html` are reachable only from them and from `404.html`.** Four pages of real content are unreachable from the homepage. — `[structural]`
8. **`products.html` duplicates `departments.html`**, including a duplicate `<title>` (`products.html:7`). Decide which survives. — `[structural]`
9. **Broken nav anchor `departments.html#garden`** on 9 pages; the id is `seasonal` (`departments.html:237`). The dropdown also omits the existing `#snow`. — `[quick win]`
10. **No `:focus` or `:focus-visible` style anywhere**, combined with `a{text-decoration:none}`. Keyboard users get only the UA default outline. — `[quick win]`
11. **The desktop dropdown is keyboard-inoperable on 9 pages** — `:hover` only, and the JS handler returns above 820px (`paint.html:39,203`). Adding `:focus-within` fixes it. — `[quick win]`
12. **No `sitemap.xml`, no `robots.txt`, no favicon.** With four orphaned pages, a sitemap is currently the only discovery path. — `[quick win]`
13. **`index.html` has no structured data**, and the site mixes `HardwareStore` (3 pages) with `Store` (2) for one business with no `@id`. `openingHours` appears only on `snow.html`. — `[quick win]`
14. **Missing canonicals on all 8 department detail pages.** — `[quick win]`
15. **`og:image` is broken on 10 pages** and relative where OG requires absolute URLs. — `[quick win]`
16. **`reviews.html` claims `ratingValue 4.9` / `reviewCount 143`** while showing 6 testimonials, with no `address`/`url` on the entity (`reviews.html:75`). Rich-result eligibility and factual accuracy both need the store owner's input — see open questions. — `[structural]`
17. **`--secondary #ea1c24` misses WCAG AA for normal text at 4.48:1** (4.22:1 on the page background) — it is the colour of every primary button label and every phone number. The existing hover value `#c41218` clears AA at 6.09:1. — `[refresh]`

### Medium — quality and consistency

18. **`<main>` missing on 8 of 20 pages** (`index`, `services`, `contact`, `products`, `reviews`, `brands`, `deals`, `404`); no skip link anywhere. — `[quick win]`
19. **Heading hierarchy skips h2 on all 8 department detail pages** — content sections are `<h3>` under a sidebar-only `<h2>` (`paint.html:43,61`). — `[quick win]`
20. **No `width`/`height` on any of 122 images** (layout shift) and **no `loading="lazy"`** on any of them. — `[quick win]`
21. **Two hamburger implementations** — inline `onclick` on 7 pages, `addEventListener` on 13. — `[refresh]`
22. **The mobile submenu writes `style.display` inline and never clears it** (`paint.html:207`), so it stays open when the viewport widens past 820px. No `resize` handler exists. — `[quick win]`
23. **Hamburger has no `aria-controls`, no Escape-to-close, no focus return, and a static `aria-label="Open menu"`.** — `[refresh]`
24. **No `aria-current`** on any nav item — nothing indicates the current page. — `[quick win]`
25. **Review stars are bare `★` glyphs at 1.78:1 contrast with no accessible name** (`reviews.html:28,53`). — `[quick win]`
26. **`role="banner"` misapplied** to `<section class="hero">` (`404.html:77`). — `[quick win]`
27. **Dead code in `index.html`:** `.has-sub`/`.sub-menu`/`.service-list` CSS (`:54-68`, `:141`), the submenu JS (`:453-467`), and the fully overridden `.services-strip`/`.cta-locksmith` block (`:104-114`). — `[quick win]`
28. **`.card:nth-child(n)` stagger covers 8 cards but the grid has 9** (`index.html:94-97` vs `:316-324`). — `[quick win]`
29. **`departments.html`'s alternating layout depends on `:nth-child(even)`** (`:65`), so inserting a section flips every stripe below it. — `[refresh]`
30. **The Google Maps `pb=` parameter contains placeholder segments** (`0x…9555555%3A0x123456789abcdef`, `4v0000000000000`) on both embeds. Verify it resolves to the real storefront. — `[quick win]`
31. **`geo.longitude` disagrees between `contact.html`'s JSON-LD (`-73.89814`) and its own map embed (`-73.90033`).** — `[quick win]`
32. **`services.html:250` JSON-LD `image` points at `/public/images/yonkerslogo.png`** — the same bad `public/` prefix. — `[quick win]`
33. **20 discrete font sizes, 6 near-duplicate `clamp()` heading variants, 6 unrelated shadow values, 25 ad-hoc spacing values, 3 near-identical light-hover greys.** Ripe for a real scale. — `[refresh]`
34. **12 different class names for one hero component** (`.hero`, `.page-hero`, `.hero-sm`, `.hero-paint`, …). — `[refresh]`
35. **`.site-header` is sticky on 3 pages and static on the 8 department pages** (`index.html:40` vs `paint.html:26`). — `[refresh]`
36. **`.btn` padding differs by page** (`.75rem 1.6rem` vs `.6rem 1.2rem`). — `[refresh]`
37. **`.sidebar{display:none}` below 820px** removes department in-page navigation on mobile with no replacement (`paint.html:84`). — `[refresh]`
38. **Hours rendered three ways** across `faq.html:242`, `services.html:99` and the other 18 footers. — `[quick win]`

### Low — hygiene

39. **`default.php` is Hostinger's placeholder** and should be deleted once its hosting implication is recorded. — `[quick win]`
40. **`images/heroindex.png` (1.04 MB) is unreferenced.** — `[quick win]`
41. **`deals.html:131` advertises "$8.99 per bag through August"** with no year; may be years stale. — `[quick win]`
42. **51 inline `style=` attributes**, almost all the same three footer/link colour rules. — `[refresh]`
43. **`snow.html:4` logo alt drifts** from the other 19 pages. — `[quick win]`
44. **All 24 images are PNG, including photographs.** — `[refresh]`

### Structural opportunities (the reason for the redesign)

45. **Extract the shared shell** — one header, one nav, one footer, one token block, one script. The tokens are already identical across all 20 pages, which makes this the safest starting move. — `[structural]`
46. **Make the department list data, not markup.** Nine departments are hand-maintained in five places (index cards, `departments.html` sections, `.jump-links`, the family-C dropdown, `products.html`). — `[structural]`
47. **Initialise a git repository.** There is no version control, no history and no rollback for a 45 MB site with no build step. This should happen before any other change. — `[structural]`
48. **Make the footer NAP block single-source.** It is the site's most accurate asset and its most-duplicated one. — `[structural]`

---

## Open questions

Recorded rather than guessed. Each needs the store owner or a live-site check.

1. **Where did the ~100 missing images go?** Are they in an unsynced folder, were they lost, or were the pages built against images that never existed? The answer decides whether this is a restore or a photo shoot. This directory sits under OneDrive, so a partial sync is plausible but unverified.
2. **`departments.html` or `products.html`?** Both are live, both titled "Departments", each reachable only from its own nav family. Which is intended? `products.html` also lists 25 hard-coded prices — are those current?
3. **Are the `deals.html` prices and the "through August" claim current?** No year is given (`deals.html:131`).
4. **Is `4.9 / 143 reviews` (`reviews.html:75`) real, and where does it come from?** If it is a Google rating, the markup must reflect reviews actually shown on the page; if invented, it should be removed.
5. **Is the Google Maps embed correct?** The `pb=` string contains obvious placeholders on both `index.html:401` and `contact.html:39`. It should be re-copied from Google Maps.
6. **Which longitude is right — `-73.89814` (JSON-LD) or `-73.90033` (map embed)?**
7. **Where should contact-form submissions go?** `service@yonkerspaintandhardware.com` is the obvious candidate, but FormSubmit requires a one-time email confirmation to activate. Is FormSubmit still the intended service?
8. **Should `thanks.html` be created, or should `_next` be dropped** in favour of FormSubmit's default confirmation page?
9. **Are `brands.html`, `deals.html`, `reviews.html` and `faq.html` wanted?** They are unreachable today. Keep and link them, or retire them?
10. **How does the site deploy?** `default.php` establishes Hostinger, but not whether it is FTP, the hPanel file manager, or something else. This constrains every build-step option.
11. **Is there a vector logo source?** `yonkerslogo.png` is a 500×500 raster; a vector original would materially improve the refresh.
12. **Does the hero text stay readable over the intended photographs?** The `rgba(0,0,0,.35)`/`.45` overlays cannot be evaluated with 18 of 20 hero images missing.
13. **Is the store's Google Business Profile claimed?** That, not the site, is usually the dominant local-SEO surface, and it should be the authority for hours and geo.
14. **Is Spanish-language content wanted?** `index.html:299` and `about.html:37` advertise "¡Hablamos Español!" but the entire site is `lang="en"` with no Spanish pages.
15. **Was there ever version control for this site?** No `.git`, no backups, no history — worth confirming nothing exists elsewhere before treating the current files as authoritative.
