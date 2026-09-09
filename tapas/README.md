# Tapas — hero + landing page

The MacBook Neo frame-sequence hero, converted to a restaurant version. The
scroll engine is a straight port of the original component; only what the
frames contain has changed.

## What was kept from the original

`js/hero.js` reproduces `FrameSequenceHero` 1:1 — same easing (`0.28` lerp,
`0.08` snap threshold), same `scrollY / (spacerHeight - innerHeight)` progress
math, same eager-load-140-then-the-rest preloader, same `steps[]` range
matching and tick bars, same `fsh-*` class structure.

One structural change: the stage is `position: sticky` instead of fixed, with
`margin-bottom: -100vh`, so it releases into the page below. In the original
demo the hero *was* the whole document and never had to let go. The negative
margin keeps the sticky range and the progress range ending on the same pixel.

## What the original animation actually was

The MacBooks were not objects with position/rotation/scale — they were 941
pre-rendered JPEGs of Apple's marketing video, drawn one per scroll position.
Nothing could be "swapped out" of them. The restaurant version therefore needs
its own frame sequence, which is what the two steps below produce.

## Finishing the hero

**1. Download the four plated dishes** from the Higgsfield gallery and save
them here as:

```
images/dish-01.jpg   short rib nachos
images/dish-02.jpg   hot honey chicken bites
images/dish-03.jpg   loaded beef nachos
images/dish-04.jpg   prime sliders
```

At this point the page already works — the hero runs the real engine over the
four stills. Good enough to show someone.

**2. Generate one short clip per dish** on Higgsfield (slow push-in or a gentle
orbit over the plate, ~5s, 1:1), download them, then:

```bash
cd tapas
./tools/build-frames.sh clip-01.mp4 clip-02.mp4 clip-03.mp4 clip-04.mp4
```

That cross-dissolves the clips into one continuous shot, extracts numbered
webp frames into `frames/`, and rewrites `FRAME_COUNT` / `USE_FRAMES` in
`index.html`. Reload and the hero is the full scrubbed sequence.

Tuning lives at the top of the script — `FPS`, `WIDTH`, `QUALITY`, `XFADE`.
At the defaults expect roughly 250 frames and 6-8 MB.

## Still to fill in

Everything marked with a dashed orange chip in the page is a placeholder that
must not be guessed at:

- real Google rating, review count, and review quotes
- street address, hours, phone number

The Directions button already points at the real Google Maps listing.

## Files

```
index.html            page + hero config (the counterpart of the Demo file)
css/hero.css          the fsh-* styles
css/site.css          design tokens + sections below the hero
js/hero.js            the ported scroll engine
js/site.js            reveal-on-scroll for the page below
tools/build-frames.sh video -> frame sequence
```

No build step. Open `index.html`, or serve the folder.
