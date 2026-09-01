# Photography needed

This page is built to be **image-forward** — the design's only job is to frame the
restaurant's own photography, so it needs the real thing before launch. Every slot
below already works with a soft procedural placeholder (so the page never looks
broken), and upgrades automatically the moment the matching file is dropped in —
no code changes needed.

Drop files into this folder using these **exact filenames**:

## Hero (ambient sequence, full-bleed)
Wide, cinematic shots. These crossfade slowly behind the headline — pick images with
open space near the bottom third so the headline stays legible.

| Filename | Suggested shot |
|---|---|
| `hero-1.jpg` | The dining room, warm evening light |
| `hero-2.jpg` | A hero plate — something with color (e.g. the vodka rigatoni) |
| `hero-3.jpg` | Exterior / entrance at dusk |
| `hero-4.jpg` | Hands plating or the open kitchen |

Recommended: 2400×1400px or larger, landscape, compressed to ~300–500KB (JPG, quality ~80).

## Gallery ("The Table" section)
Editorial, varied crops — not a uniform grid. Mix close-up plating with room/atmosphere.

| Filename | Used for |
|---|---|
| `gallery-rigatoni-vodka.jpg` | Stuffed Rigatoni alla Vodka (large tile) |
| `gallery-dining-room.jpg` | Dining room, set for evening |
| `gallery-calamari.jpg` | Calamari Fritti |
| `gallery-veal-saltimbocca.jpg` | Veal Saltimbocca |
| `gallery-vongole.jpg` | Linguine alle Vongole |
| `gallery-kitchen.jpg` | Kitchen / Gennaro at work (wide banner tile) |

Recommended: at least 1400px on the short side — these get a hover ripple effect, so
sharp detail helps.

## About section
| Filename | Suggested shot |
|---|---|
| `about-portrait.jpg` | Gennaro & Danielle, portrait orientation, tall crop (the frame is ~2:3) |

## Notes
- All images are loaded with `loading="lazy"` and `object-fit: cover` — any
  reasonable aspect ratio works, but match the "suggested shot" framing where noted
  so nothing gets awkwardly cropped.
- If a file is missing, the `<img>` quietly removes itself and the warm gradient
  placeholder underneath stays visible — nothing ever shows a broken-image icon.
- The hero and gallery-hover WebGL effects (`js/main.js`) try to load these same
  files as GPU textures first, falling back to a matching procedural gradient if
  the file isn't there yet.
