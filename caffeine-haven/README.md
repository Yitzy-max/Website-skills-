# The Caffeine Haven — scroll-driven landing page

An editorial, image-forward landing page for **The Caffeine Haven**
(Main Street, Toms River, NJ · Howell, NJ). Built with Vite + vanilla
JavaScript, GSAP/ScrollTrigger, Lenis smooth scroll, and Three.js for the
gallery's scroll-scrubbed image transitions and hover-distorted thumbnails.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Requires Node 18+.

## What's here

```
index.html            markup for every section
src/main.js            Lenis + GSAP wiring: header, hero video scrub,
                        scroll reveals, parallax, gallery orchestration
src/style.css          design tokens + layout (see :root for the palette)
src/webgl/
  gallery-stage.js      pinned Three.js crossfade "stage" for the gallery
  thumb-distortion.js   per-thumbnail WebGL hover-ripple shader
```

## Brand photography

The hero background and the six gallery images were generated with
Higgsfield (cinematic macro coffee-shop photography — no stock/scraped
photos) and are hotlinked from Higgsfield's media CDN via the `CDN`
constant at the top of `src/main.js`. That's the fastest path to a working
site; swap them for locally-hosted files whenever you want the assets
under your own control — see `public/images/README.md` for the two-step
swap.

## Design notes

- **Palette**: near-black warm charcoal ground, warm off-white ink, a
  single restrained amber accent (`--accent` in `src/style.css`) — the
  photography carries the color, not the UI.
- **Type**: Fraunces (display/serif) for headlines and italics, Figtree
  for body/UI text — both loaded from Google Fonts.
- **Motion**: the hero video scrubs by scroll position (via
  `video.currentTime`, not autoplay) across the hero + impact-statement
  scroll range, then normal opaque section backgrounds take over so nothing
  fights the content below. The gallery pins and crossfades between six
  stills with an organic grain-dissolve shader; the thumbnail rail adds a
  subtle cursor-follow ripple + chromatic aberration on hover. Every
  `[data-reveal]` element and the parallax background layers use
  ScrollTrigger; `prefers-reduced-motion` disables all of it gracefully.
- **Content**: nav order (Order Online / Menu / Contact), the story, hours,
  and menu highlights are drawn from The Caffeine Haven's real public
  listings (Google/Yelp/Instagram/DoorDash), lightly edited for the page's
  editorial voice — not invented.

## Known trade-offs

- The production JS bundle (GSAP + Three.js + Lenis) is ~170 KB gzipped in
  one chunk; `vite build` flags this. Fine for a single-page microsite —
  split with dynamic `import()` if this grows into a multi-page site.
- Hotlinked photography (see above) means the site currently depends on
  Higgsfield's CDN staying up. Self-host for a production launch.
