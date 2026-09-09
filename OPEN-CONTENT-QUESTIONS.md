# Open content questions

Things a page would be better for saying, that could not be sourced from
copy already in the repo, a subject row in `IMAGE-MANIFEST.md`, or a
statement from the owner.

**The owner answered most of these on 2026-08-30.** Resolved items are kept
below rather than deleted, so the record of what was asked, what was
answered, and what was deliberately declined survives.

Every claim that came out of those answers is logged in
`CONTENT-SOURCES.md` as "owner statement, 2026-08-30".

> **Note on numbering.** The owner's replies referenced item numbers up to
> 14; this file has ever only had 11. There is no consistent offset between
> the two lists, so each answer was matched to a question **by content**, not
> by number. Two of the owner's numbers could not be matched to anything here
> and are listed under "Unmatched replies" at the end.

---

## Resolved

### 1. Who the family is — **DECLINED, deliberately**

> The family is not to be named anywhere, and neither is the generation.

The story stays "family-run since 1966" with no names. This is a decision,
not an omission: **do not "fix" it in a later pass.** Recorded in
`CONTENT-SOURCES.md` for that reason.

### 2. What happened between 1966 and now — **partly answered**

> The store later moved into its current, larger building. No date given.

Added to the About story as an undated waypoint: "The shop outgrew its first
home, and later moved into the larger building it occupies today."

*Still would help:* the year of the move, and when the Benjamin Moore
dealership or the locksmith counter started. Not urgent.

### 3. Delivery: cost, radius, lead time — **partly answered**

> Delivery from $15, within roughly a 7-mile radius.

Both now appear on the services page and the FAQ, marked "(as of 2026)".

*Still open:* whether same-day delivery has a cut-off time, and whether
there is a minimum order — see G. Same-day itself is now confirmed (item 12)
and `/delivery.html` frames it as call-to-confirm rather than implying a
deadline.

### 4. Are the prices on the site still right? — **RESOLVED**

> All three confirmed current: keys from $2, delivery from $15, sheet-rock
> first two cuts free then $1 each.

Each now carries "(as of 2026)" at its first appearance on a page, and the
services page carries "Prices current as of 2026; confirm at the counter."

This also unblocked `service-key-wall-signage-01.webp`, whose "Standard Keys
$2.00" sign is confirmed accurate. It is now placed on the key-duplication
card.

### 5. The Aura promotion — **RESOLVED**

> It is a recurring promotion, not a live one-off.

Reworded from "Aura is currently 30 % off while supplies last" to "Benjamin
Moore Aura goes on promotion regularly; ask at the counter or check the
current in-store flyer for the latest offer." No percentage, no "currently".

### 6. Parking — **RESOLVED (the parking half)**

> Street parking along Main Street, plus parking garages nearby.

Added beside the address on the Contact page and as a services FAQ, which
the `FAQPage` schema picks up automatically.

The **step-free access** half was later answered from the Business Profile —
see item 10.

### 7. The Spanish paragraph — **RESOLVED**

> Approved.

The Contact page paragraph stands as written. The flag has been cleared in
`REPORT.md`.

### 8. Is Safeguard Lock & Key still the arrangement? — **RESOLVED**

> Current, and they are happy with the link.

No copy changed; the homepage locksmith CTA and the About mention are now
sourced rather than assumed.

### 9. The owner's photographs — **RESOLVED**

> The staff member in the store T-shirt is Mike, the owner. Confirmed OK to
> feature. First name only, never a surname.

`staff-portrait-storefront-01.webp` is now the About page lead figure and
`service-counter-portrait-01.webp` the services page lead figure, both
captioned with the first name only. Their manifest rows moved from held to
placed and their alt text was rewritten to name him.

### 10. Step-free access at the entrance — **RESOLVED**

> The entrance is wheelchair accessible.

Source: the Google Business Profile accessibility attribute, which is
owner-controlled. Now stated on the Contact page beside the parking note, in
the HardwareStore schema as an `amenityFeature`, and in `llms.txt`.

### 11. Payments — **RESOLVED**

> Not cash-only. Credit, debit and NFC mobile payments accepted.

Source: GBP. On the Contact page, as a services FAQ, as `paymentAccepted` in
the schema, and in `llms.txt`. Consistent with the existing FAQ answer
listing Visa, Mastercard, Amex, Discover, Apple Pay and cash.

### 12. Same-day delivery — **PARTLY RESOLVED**

> Same-day delivery is offered.

Source: GBP service option, corroborating the "Same-Day" badge already in the
repo copy. Now on `/delivery.html`, framed as call-to-confirm.

*Still open:* the cut-off time and the minimum order — see G below. The copy
deliberately implies neither.

### 13. Unattributed testimonials — **RESOLVED**

Raised at the original site audit: the six testimonials on the reviews page
had no source and could not be verified, and the `AggregateRating` claiming
4.9 from 143 reviews was removed during the Eleventy port for the same
reason.

All six are now replaced by eight real Google reviews, quoted verbatim from
the owner's review dump, attributed by display name, and visibly labelled.
No review schema of any kind was added.

---

## Still open

### B. Contractor account terms

"Bring your resale/tax form to open an account" is still the only mention.
Nothing on terms, minimums or how billing works.

**Needed:** enough for two honest sentences.

### C. Rentals, propane, screen repair

The FAQ covers knife and tool sharpening. Nothing says whether you rent
tools, exchange propane, or repair window screens — all things people phone
a hardware store about.

**Needed:** which of these you do, and any constraint worth stating.

### D. Store hours on holidays

`site.json` carries the regular week only. Nothing says what happens on
public holidays, or whether winter hours differ.

**Needed:** holiday closures, and any seasonal hours worth publishing.

*This one may have been answered under a number that could not be matched —
see "Unmatched replies".*

### E. What is on the pegboard in `dept-fasteners-pegboard-01.webp`

The packets in that photograph cannot be identified at any resolution
available. They may be fasteners or electrical connectors. Its caption and
alt text are deliberately neutral ("packets of small hardware") and should
stay that way until someone who knows the aisle looks at it.

**Needed:** a glance at the photo by someone who knows the store.

### F. The held background person in `service-counter-customer-01.webp`

The two people in the foreground are not the person who must not appear. A
third person in the background — behind the Woodluxe display — has the same
hair and a blue-and-white checked garment, but their face is a small,
out-of-focus profile. Not a face match, so not called either way. The image
is unplaced as a precaution and its manifest row is marked HELD.

**Needed:** your look at `triage/audit/bg-third-person.jpg`. Restoring the
image is a one-line change if it is someone else.

### F2. The GBP service area conflicts with the site's delivery copy

The Business Profile lists a service area of **Bronx, Westchester and
Rockland**. The site says **Yonkers, Bronxville, Mt Vernon and
Hastings-on-Hudson, roughly a seven-mile radius**, which is the sourced copy
and considerably narrower.

Both are owner-controlled, so this is not a sourcing problem — it is two
different answers to the same question, and only the owner can say which is
right. **Nothing was changed.** The site keeps the narrower, sourced version.

**Needed:** which is accurate? If the wider area is real, the delivery page,
the services copy, `llms.txt` and the `Service` schema's `areaServed` all
want updating together. If the GBP entry is aspirational, it should be
narrowed there instead.

### G. Delivery cut-off and minimum order

Carried over from the delivery answer above.

### H. The Business Profile spells the name with "and"

GBP renders the business as **"Yonkers Paint and Hardware"**. The site,
every JSON-LD block, `llms.txt` and the domain all use the ampersand:
**"Yonkers Paint & Hardware"**.

**Nothing was changed.** This is noted rather than fixed because the two are
recognisably the same entity, search engines reconcile them without help, and
the ampersand is what the storefront sign itself says. Worth aligning only if
the owner wants one canonical rendering.

---

## Unmatched replies

Two numbers in the owner's reply could not be matched to a question in this
file, and no answer text came with them:

- **their #6** — the nearest unanswered question here is holiday hours (D
  above), which is why D is still listed as open rather than resolved. If #6
  was meant to answer it, the answer did not come through.
- **their #12** — nothing in this file corresponds. It may belong to a list
  kept elsewhere.

Neither was guessed at. Say the word and they can be closed properly.

---

## Not asked, deliberately

These would improve the site but need a commitment, not a fact:

- **A blog or seasonal advice section.** Still the strongest remaining
  local-SEO lever, and still only worth it if somebody keeps writing.
- ~~**Reviews with a verifiable source.**~~ **RESOLVED 2026-08-30.** The six
  unattributed testimonials are gone, replaced by eight real Google reviews
  quoted verbatim and attributed by display name. Note that
  `AggregateRating` did **not** come back and should not: marking up reviews
  of yourself is self-serving review markup and against Google's policy. The
  quotes are visible content only.
