# The Caffeine Haven

A one-page site for a small café in Howell, NJ. Plain HTML, CSS and JavaScript.
No build step, no framework, nothing to install. Open it or upload it and it runs.

## Run it locally

Any static server works:

```
cd caffeine-haven
python3 -m http.server 4517
```

Then open http://127.0.0.1:4517. Opening `index.html` straight from the file
system mostly works too, but a server is closer to the real thing.

## Add the photos

The `images` folder is empty on purpose. Drop the twelve photos in there using
the filenames listed in `images/README.md` and the page picks them up. Until a
file exists, that frame renders as a warm dark plate instead of a broken image,
so the page never looks broken while you're still shooting.

## What's in here

- `index.html` — the whole page, top to bottom
- `css/style.css` — layout, type, and the empty-frame treatment
- `js/main.js` — the scroll motion, the open/closed status, the wayfinding label
- `js/vendor/` — GSAP, ScrollTrigger and Lenis, kept local so nothing is fetched
  from a CDN at runtime
- `fonts/` — Fraunces and Hanken Grotesk as variable woff2 files, self-hosted
  (both are Open Font License, licenses included)

## Things worth knowing

- The open/closed line in the top bar is live. It reads the clock in New York
  time against the hours in `js/main.js` (`openStatus`). Change the hours there
  and in the "When" block near the bottom of `index.html`.
- Everything still reads if JavaScript fails or the visitor has reduced motion
  turned on. The page just stops moving.
- Business details (address, phone, hours, Instagram) also live in the
  structured data block at the top of `index.html`. If any of them change,
  update both places so Google stays in sync.
