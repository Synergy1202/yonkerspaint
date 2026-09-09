# Functionality test matrix

Things a script cannot check. Work through this before a launch, and again
after any change to the nav, the form, or `.htaccess`.

**To test locally:** `npm run build`, then serve the output and open it in a
browser — `npx eleventy --serve` gives you <http://localhost:8080>. Some
items only work on the real server: the 301s and the 404 page need Apache to
read `.htaccess`, so they are marked **live only**.

Automated checks that already pass, so you do not need to repeat them by
hand: broken links and missing images, JSON-LD parsing, colour contrast,
stylesheet rules, UI glyphs, and entity consistency. Run them all with
`npm run build && npm run check:all` (seven checks).

---

## 1. Departments mega-panel — mouse

| # | Step | Expected |
|---|---|---|
| 1.1 | Hover "Departments" in the header | Full-width panel drops with all 9 departments in a 3-column grid, each with a one-line blurb |
| 1.2 | Move the pointer down into the panel | Panel stays open; it does not close crossing the gap |
| 1.3 | Hover a department tile | Tile tints; the whole tile is clickable, not just the name |
| 1.4 | Click one | Lands on that department |
| 1.5 | Click "View all departments" | Lands on `/departments.html` |
| 1.6 | Move the pointer off entirely | Panel closes |
| 1.7 | On a department page, open the panel | That department's tile shows the current-page marker, and the "Departments" tab itself reads as the active section |

## 2. Departments mega-panel — keyboard

| # | Step | Expected |
|---|---|---|
| 2.1 | Tab once from page load | "Skip to main content" appears; Enter jumps past the whole header |
| 2.2 | Tab to "Departments" | Visible focus ring on the button |
| 2.3 | Press Enter or Space | Panel opens |
| 2.4 | Keep tabbing | Focus moves through all 9 departments then "View all", every one visible |
| 2.5 | Press Escape | Panel closes, **focus returns to the Departments button** |
| 2.6 | Tab past the last panel item without pressing Escape | Panel closes on its own; focus continues to Services |
| 2.7 | Tab through the utility strip first | Phone, then hours (not focusable), then Directions |

## 3. Mobile drawer

Test on a real phone, and in a desktop window narrowed below 820px.

| # | Step | Expected |
|---|---|---|
| 3.1 | Tap the hamburger | Drawer slides in from the right, roughly 22rem wide, full height |
| 3.2 | Look behind it | A dark scrim covers the page |
| 3.3 | Try to scroll the page behind the drawer | It does not scroll; only the drawer scrolls |
| 3.4 | Tap the scrim | Drawer closes |
| 3.5 | Tap the × in the drawer header | Drawer closes, focus returns to the hamburger |
| 3.6 | Press Escape with the drawer open | Same |
| 3.7 | Open the drawer and Tab repeatedly | **Focus cycles inside the drawer and never escapes to the page behind** |
| 3.8 | Scroll to the bottom of the drawer | The call button is pinned there and stays visible |
| 3.9 | Tap the call button | Dialer opens with the store number |
| 3.10 | Open the drawer, then widen the window past 820px | Drawer state clears; the desktop nav is not left stuck open and the page scroll is restored |
| 3.11 | Reverse: open at desktop width, then narrow | No stuck panel |

## 4. Departments accordion (inside the drawer)

| # | Step | Expected |
|---|---|---|
| 4.1 | Tap "Departments" in the drawer | The 9 departments expand in place; the page does **not** navigate |
| 4.2 | Tap it again | They collapse |
| 4.3 | Tap a department | Navigates, drawer closes |
| 4.4 | With a screen reader | The button announces expanded/collapsed and names the panel it controls |
| 4.5 | Check the blurbs | Hidden on mobile by design — names only, so the list stays scannable |

## 5. No-JavaScript

Disable JavaScript (Chrome DevTools → Settings → Debugger → Disable JavaScript) and reload.

| # | Step | Expected |
|---|---|---|
| 5.1 | Load any page at desktop width | Header, nav and mega-panel behave normally on hover and focus |
| 5.2 | Narrow below 820px | **No hamburger.** The nav renders as a plain stacked list under the logo |
| 5.3 | In that stacked list | All 9 departments are visible without any tapping — the panel is expanded by default |
| 5.4 | Click through several links | Everything navigates |
| 5.5 | Open a guide | The full article is there; nothing is built by script |
| 5.6 | Check the footer | All 19 links present and working |

`npm run check:nojs` proves points 5.1–5.6 statically on every page by
stripping every `<script>` block and asserting the destinations survive.

## 6. Breadcrumbs and CTA band

| # | Step | Expected |
|---|---|---|
| 6.1 | Open any department page | Breadcrumb reads Home / Departments / *name*, with the last item not a link |
| 6.2 | Open any guide | Home / Guides / *name* |
| 6.3 | Click a breadcrumb link | Navigates |
| 6.4 | Scroll to the bottom of any content page | CTA band with address, parking line, hours and two buttons |
| 6.5 | Check `/404.html` and `/thanks.html` | **No** CTA band — they opt out |
| 6.6 | Tap Directions in the CTA band or the utility strip | Opens the Google Business Profile map link in a new tab |

## 7. Contact form

| # | Step | Expected |
|---|---|---|
| 7.1 | Submit empty | Browser blocks it, focuses Name |
| 7.2 | Fill Name only, submit | Blocked at Email |
| 7.3 | Enter `notanemail` | Rejected as an invalid address |
| 7.4 | Fill Name, Email, Message; leave Phone blank | Submits — Phone is optional |
| 7.5 | Tab through the form | Every field reachable, focus always visible, labels read correctly |
| 7.6 | Inspect the form for a `_honey` field | Present and hidden; a human never sees or fills it |
| 7.7 | **Live only:** submit for real | FormSubmit sends the message and returns you to `/thanks.html` |
| 7.8 | On a phone | Email field shows the email keyboard; Phone shows the number pad |

> **Not yet live.** FormSubmit needs a one-time activation: submit the form
> once on the real domain, then click the link in the confirmation email sent
> to `service@yonkerspaintandhardware.com`. Until that is done, submissions
> are not delivered. See `README.md`.

## 8. Redirects — live only

Test on the real domain. Use a private window so nothing is cached, and
watch the address bar.

| # | Visit | Expected |
|---|---|---|
| 8.1 | `/products.html` | 301 to `/departments.html` |
| 8.2 | `/brands.html` | 301 to `/departments.html` |
| 8.3 | `/deals.html` | 301 to `/index.html` |
| 8.4 | Any old department URL, e.g. `/paint.html` | Loads directly, no redirect |

To confirm it is a real 301 and not a soft one:
`curl -I https://yonkerspaintandhardware.com/products.html` should show
`HTTP/1.1 301` and a `Location:` header.

## 9. 404 and thanks — live only

| # | Step | Expected |
|---|---|---|
| 9.1 | Visit a made-up URL | The styled 404 page, not Apache's default |
| 9.2 | On it | Header, footer and nav all work; the four suggested links go somewhere |
| 9.3 | Check the source | `<meta name="robots" content="noindex">` present |
| 9.4 | Visit `/thanks.html` | Styled page with the phone number and store hours |
| 9.5 | Check `/sitemap.xml` | 21 URLs including the 5 guides and the guides index; **no** 404 or thanks |
| 9.6 | Check `/robots.txt` | Sitemap line present; AI crawlers allowed |
| 9.7 | Check `/llms.txt` | Loads as plain text with correct address, phone, hours and a Guides section |

## 10. Phone walk — do this on an actual phone

The site is used mostly on phones, and this is the part desktop testing
misses. Walk the whole thing on a real handset, on cellular rather than
office wifi.

| # | Check |
|---|---|
| 10.1 | Homepage hero: headline readable over the photo, both buttons easy to hit |
| 10.2 | **Tap the "Call 914-963-3525" button** — the dialer opens with the right number |
| 10.3 | Tap the footer phone number — same |
| 10.4 | Department grid: cards in a sensible column count, nothing cropped oddly |
| 10.5 | The three photo-less departments (electrical, garden, snow) look deliberate, not broken |
| 10.6 | On a department page, the jump-link chips are a scrolling row under the header and actually scroll |
| 10.7 | Tap a chip — jumps to the right section, and the heading is not hidden behind the sticky header |
| 10.8 | Department FAQs open and close on tap |
| 10.9 | Contact page: the map loads and can be panned without trapping the page scroll |
| 10.10 | Contact page: the Spanish paragraph reads correctly |
| 10.11 | Tap the email address — the mail app opens |
| 10.12 | Instagram link opens the app or the site |
| 10.13 | Rotate to landscape and back — nothing overlaps or gets stranded |
| 10.14 | With the system font size turned up two steps, text still fits and nothing clips |
| 10.15 | In a browser set to reduced motion, nothing animates |

---

## What to do if something fails

1. Reproduce it and note the page, the browser and the screen width.
2. Run `npm run build && npm run check:all` (seven checks) — an automated check may already
   name the cause.
3. For layout issues, check whether it also happens with JavaScript disabled:
   everything except the hamburger and the dropdown toggle is pure CSS, so
   that narrows it fast.
