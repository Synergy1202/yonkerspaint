# Deploying the site

For **yonkerspaintandhardware.com** on Hostinger shared hosting.

Written so someone who has not seen this repo can do it. If anything below
does not match what you see on screen, stop and ask rather than improvising —
the rollback note at the bottom assumes nothing else has been changed.

---

## What you are uploading

A zip of the finished website. It contains **90 files, about 5 MB**, and it
is built so that its contents land directly in `public_html` — there is no
folder inside it to dig through.

It includes a file called **`.htaccess`**. That leading dot matters: it is the
file that makes the redirects, the security headers and the caching work. Some
file managers hide it by default. There is a step below to confirm it arrived.

---

## Build it

```
npm install          # first time only
npm run build
npm run check:all
```

`check:all` runs eight checks. **All eight must pass before you deploy.** The
last one, `check:dist`, exists specifically to catch a bad upload: missing
`.htaccess`, an image that was withdrawn for legal reasons sneaking back in,
an internal folder leaking, or a sitemap pointing at a page that does not
exist.

Then make the zip:

```
node tools/make-deploy-zip.js
```

or `npm run deploy:zip`, which is the same thing.

It re-runs the build integrity check first and **refuses to package a build
that does not pass**, then writes `deploy/yonkers-site-YYYYMMDD.zip` and
prints the file count, the size, and a confirmation that `.htaccess` is
inside and that the paths are not nested.

> **One environment note.** This repo lives inside a OneDrive-synced folder,
> and files the build deleted have been observed reappearing in `_site/`
> afterwards — including images that were withdrawn and must never be
> published. That is why the packaging step re-checks rather than trusting
> the build. **If `deploy:zip` refuses, do not work around it:** run
> `npm run build` again and package immediately afterwards.

---

## Upload it, in hPanel

1. Log in to **hPanel** at <https://hpanel.hostinger.com>.
2. Choose the **yonkerspaintandhardware.com** hosting plan.
3. Open **Files → File Manager**.
4. Go into **`public_html`**.

### Back up what is there first

5. Select everything currently in `public_html`.
6. Right-click → **Compress**, name it `backup-YYYYMMDD.zip`, and **move that
   backup out of `public_html`** — up one level, into the home folder. If you
   leave it in `public_html` it becomes a publicly downloadable copy of the
   site.
7. Once the backup exists and has been moved, delete the old contents of
   `public_html`.

### Put the new site in

8. With `public_html` open and empty, click **Upload** and choose
   `deploy/yonkers-site-YYYYMMDD.zip`.
9. When it finishes, right-click the zip → **Extract**, extracting into
   `public_html` itself.
10. Delete the zip from `public_html` once extraction is done.

### Confirm `.htaccess` arrived

11. In File Manager, open **Settings** (top right) and turn on **Show hidden
    files**.
12. Confirm `.htaccess` is listed in `public_html`, alongside `index.html`.

**If `.htaccess` is missing, none of the redirects or security headers are
live.** Re-extract, or upload that one file on its own.

---

## Verify it worked

Do these in a **private/incognito window**, so nothing is served from cache.

### 1. The canonical redirects

Type each of these and watch where the address bar ends up. All four must land
on **`https://yonkerspaintandhardware.com`** with no `www` and with the
padlock showing:

| Type this | Should become |
|---|---|
| `http://yonkerspaintandhardware.com` | `https://yonkerspaintandhardware.com` |
| `http://www.yonkerspaintandhardware.com` | `https://yonkerspaintandhardware.com` |
| `https://www.yonkerspaintandhardware.com` | `https://yonkerspaintandhardware.com` |
| `https://yonkerspaintandhardware.com` | stays put, no redirect |

To confirm these are real 301s and that `http://www` gets there in **one**
hop rather than bouncing twice, run this from a terminal:

```
curl -sIL http://www.yonkerspaintandhardware.com | grep -E "^HTTP|^[Ll]ocation"
```

You want to see a single `301` followed by a single `200`. Two 301s in a row
means the rules are chaining and should be looked at.

### 2. The retired-page redirect

Visit `https://yonkerspaintandhardware.com/products.html`. It must land on
**`/departments.html`**. (`/brands.html` also goes to departments;
`/deals.html` goes to the homepage.)

### 3. A department page

Open `https://yonkerspaintandhardware.com/paint.html`. Check that:

- the photographs load
- the breadcrumb reads Home / Departments / Paint & Finishing
- the "Departments" menu in the header opens and lists all nine

### 4. The guides

Open `https://yonkerspaintandhardware.com/guides/`. Five guides should be
listed, and each should open.

### 5. The 404 page

Visit a made-up address like
`https://yonkerspaintandhardware.com/not-a-real-page.html`. You should get the
**site's own styled 404 page** with the header and footer, not a plain server
error page.

### 6. The favicon

Look at the browser tab on any page. The store logo should appear. If you see
a blank page icon, hard-refresh (`Ctrl+F5`) — browsers cache favicons hard.

### 7. The contact form

Go to `/contact.html`, fill it in and submit.

> **The form is not live until it is activated.** FormSubmit requires a
> one-time confirmation: the first submission triggers an email to
> `service@yonkerspaintandhardware.com` with a link that must be clicked.
> Until someone clicks it, submissions are not delivered.
>
> So on the first submission, expect FormSubmit's own confirmation screen
> rather than the site's thank-you page. Click the link in that email, then
> submit once more. The second time it should land on
> `https://yonkerspaintandhardware.com/thanks.html`.

### 8. Spot-check the extras

- `/robots.txt` loads and mentions the sitemap
- `/sitemap.xml` loads and lists 22 pages
- `/llms.txt` loads as plain text with the right address, phone and hours

---

## Two things about caching

**Photographs are cached for a year.** That is deliberate and makes the site
fast. But it means if you ever *replace* an image while keeping the same
filename, people who have already visited will keep seeing the old one for up
to a year. **Give a replacement image a new filename.**

**CSS and JavaScript are cached for a week.** If you push a visual fix and a
returning visitor still sees the old design, that is why. It will resolve
itself within seven days. To force it sooner, rename `css/site.css` to
something like `css/site-2.css` and update the link in
`src/_includes/layout.njk` — then everyone picks it up immediately.

---

## About HTTPS

There is deliberately **no HSTS header** yet. HSTS tells browsers to refuse
plain HTTP for a set period, and once sent it cannot be recalled — browsers
honour it until it expires. It should only be turned on once HTTPS is
confirmed working on the live domain.

Once you have verified all four redirects above and the padlock shows
everywhere, HSTS can be enabled by adding one line to `.htaccess`. Ask before
doing it; it is the single hardest thing on this list to undo.

---

## Rolling back

If something is wrong after deploying:

1. In hPanel File Manager, go to `public_html`.
2. Delete its contents.
3. Upload the `backup-YYYYMMDD.zip` you moved out in step 6.
4. Extract it into `public_html`.
5. Delete the backup zip from `public_html` afterwards, and keep the original
   copy in the home folder.

The site will be back to exactly its previous state. Nothing in this deploy
touches the database (there isn't one), email, or DNS — a rollback is purely
a matter of putting the old files back.

Keep the previous deploy zip from `deploy/` too. Rolling forward to a known
good build is often faster than restoring a backup.
