# Yonkers Paint & Hardware — project brief

Static marketing site for **yonkerspaintandhardware.com**: a Benjamin Moore dealer and neighborhood hardware store at 65 Main Street, Yonkers, NY 10701. Family-owned since 1966.

Full findings live in **`SITE-AUDIT.md`** (2026-08-30). Read that before any redesign work.

## Layout

20 hand-written HTML files at the repo root plus `images/` (24 PNGs, 45 MB). **No tooling at all** — no `package.json`, no build step, no `.css` or `.js` files, no includes, no `sitemap.xml`/`robots.txt`/favicon, **no git repository**.

- **Core:** `index` · `departments` (+ 8 detail pages: `paint` `plumbing` `electrical` `tools` `fasteners` `garden` `cleaning` `roofing`) · `services` · `about` · `contact` · `snow` · `404`
- **Orphaned** (zero or near-zero inbound links): `brands` · `deals` · `reviews` · `faq`
- **`products.html`** is a second, competing department page — same `<title>` as `departments.html`
- **`default.php`** is Hostinger's dead placeholder. Its one use: it proves hosting = **Hostinger shared hosting, PHP available**.

## Conventions actually in use

- Every page is self-contained: its own inline `<style>` in `<head>`, its own inline `<script>` before `</body>`. Header/nav/footer are copy-pasted — **9 header variants, 8 footer variants, 4 script variants** across 20 pages.
- Flat semantic class names, hyphenated, no BEM: `.site-header` `.top-nav` `.nav-toggle` `.sub-menu` `.has-sub` `.btn` `.btn-primary` `.card` `.grid` `.dept-section` `.callout` `.sidebar` `.jump-links` `.site-footer` `.footer-grid` `.copyright` `.hours`.
- Comment dividers: `/* ── Header ───── */`
- Single breakpoint for nav: **820px** (hamburger). Also 860px (department sidebar) and 880px (departments stripes).
- All JS is inside `DOMContentLoaded`, `const` locals only, nothing on `window`. **Zero libraries, zero analytics, zero cookies.**
- Three incompatible nav families: **A** points "Departments" at `products.html`; **B** at `departments.html`; **C** is an 8-item dropdown of `departments.html#…` anchors.

## Design tokens

`:root` is **byte-identical on all 20 pages** — the one thing that has not drifted. Safe to extract first.

| Token | Value | Role |
|---|---|---|
| `--primary` | `#0054a6` | Header, nav, headings, callouts |
| `--secondary` | `#ea1c24` | Buttons, phone number |
| `--dark` | `#222` | Body text |
| `--light` | `#f8f8f8` | Page background |
| `--max` | `1200px` | Content width |
| `--radius` | `4px` | Every corner |

Untokenised but load-bearing: `#fff` (207×) · `#111` footer bg · `#ccc` footer text · `#999` copyright · `#ddd` borders · `#c41218` button hover · `#003d7a` / `#b11017` gradient ends.

| | |
|---|---|
| **Font** | `Arial, Helvetica, sans-serif` only — **no web font is loaded anywhere** |
| **Sizes** | 20 ad-hoc rem values (`.72`–`2`) + 6 near-duplicate `clamp()` heading variants — no scale |
| **Spacing** | 25 ad-hoc rem values — no 4pt/8pt grid |
| **Radii** | `4px` (65×), `2px` (2×) |
| **Shadows** | 6 unrelated values, e.g. `0 3px 6px rgba(0,0,0,.25)`, `0 4px 8px rgba(0,0,0,.12)` |

**Contrast:** the blue passes everywhere (7.45:1 on white). **The red fails AA for normal text — 4.48:1 on white, 4.22:1 on `--light`** — and it is every button label and every phone number. The existing `#c41218` hover value passes at 6.09:1.

## Gotchas

- **~100 referenced images do not exist.** Whole directories are missing (`images/hero/`, `images/brands/`, `images/departments/`, one per department). **18 of 20 pages have a broken hero background.** Only `index.html` and `departments.html` render as designed — do not use the other pages as a visual reference.
- **`index.html` ships ~21.8 MB of images.** 23 of 24 PNGs exceed 300 KB; `yonkerslogo.png` is 500×500 served at 46px.
- **The contact form is dead** — `contact.html:153` posts to the placeholder `formsubmit.co/your@email.com`, and its success redirect targets a nonexistent `thanks.html`.
- **`services.html:53` and `services.html:250`** reference a `public/` directory that does not exist.
- **`departments.html#garden` is a broken anchor** on 9 pages — the real id is `seasonal`.
- **`departments.html` alternates stripes with `:nth-child(even)`** — inserting a section flips every one below it. `index.html`'s card stagger is hard-coded to 8 but there are 9 cards.
- **No `:focus` style exists anywhere**, and `a{text-decoration:none}` is global. The department-page dropdown is `:hover`-only, so it is keyboard-inoperable on desktop.
- **Editing anything shared means editing it 20 times.** Hours already render three different ways.
- **NAP is the one clean thing** — name, `65 Main Street, Yonkers, NY 10701`, `914-963-3525`/`tel:+19149633525`, and the hours values are identical on all 20 pages. Treat it as the source of truth.
- **There is no git history and no backup.** Initialise a repo before changing anything.

## Open questions (do not guess — ask)

1. Where did the ~100 missing images go? Restore, or new photography?
2. `departments.html` or `products.html` — which survives? Are `products.html`'s 25 hard-coded prices current?
3. Are `deals.html`'s prices and its unqualified "through August" claim current?
4. Is `reviews.html`'s `4.9 / 143 reviews` real, and sourced from where?
5. Both Google Maps embeds contain placeholder `pb=` segments — verify against the real listing. Also: JSON-LD longitude `-73.89814` vs map `-73.90033`.
6. Where should contact-form submissions go, and is FormSubmit still the intended service?
7. Keep or retire the four orphaned pages (`brands`, `deals`, `reviews`, `faq`)?
8. How does the site actually deploy to Hostinger — FTP, hPanel file manager, something else?
9. Is there a vector logo source?
10. Is the Google Business Profile claimed? It should be the authority for hours and geo.
11. "¡Hablamos Español!" is advertised but the site is `lang="en"` only — is Spanish content wanted?
