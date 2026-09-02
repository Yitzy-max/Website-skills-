# Photography needed

This page is built to be **image-forward** — the design's only job is to frame Caffeine
Heaven's own photography, so it needs the real thing before launch. Every slot below
already works with a soft procedural placeholder tuned to the brand's dark, low-lit
palette (so the page never looks broken), and upgrades automatically the moment the
matching file is dropped in — no code changes needed.

Drop files into this folder using these **exact filenames**:

## Hero (ambient sequence, full-bleed)
Wide, cinematic, low-light shots. These crossfade slowly behind the headline — pick
images with open, dim space near the bottom third so the headline stays legible.

| Filename | Suggested shot |
|---|---|
| `hero-1.jpg` | The main room, dim and warm, string/pendant lights on |
| `hero-2.jpg` | Steam curling off an espresso shot, backlit by a window or warm light |
| `hero-3.jpg` | The patio or entrance at dusk |
| `hero-4.jpg` | Hands pulling a shot or pouring latte art |

Recommended: 2400×1400px or larger, landscape, compressed to ~300–500KB (JPG, quality ~80).
Keep exposure low-key/moody — this is a dark site by design, not a bright one waiting
to be fixed.

## Atmosphere carousel ("The Room" section)
A horizontal, auto-sliding strip — 10-12 small cards work well. Mix close-up drinks
and pastries with a couple of room/patio/kids'-corner shots. Portrait crop (roughly
4:5) reads best.

| Filename | Used for |
|---|---|
| `gallery-01-latte-art.jpg` | A flat white / latte art close-up |
| `gallery-02-interior-wide.jpg` | Wide shot of the main room |
| `gallery-03-pastry-case.jpg` | The pastry case — croissants, buns |
| `gallery-04-reading-nook.jpg` | A quiet reading corner |
| `gallery-05-kids-corner.jpg` | The kids' corner with toys |
| `gallery-06-patio-dusk.jpg` | Outdoor patio seating, string lights, dusk |
| `gallery-07-pour-over.jpg` | A pour-over being brewed |
| `gallery-08-window-seat.jpg` | A window seat, soft daylight |
| `gallery-09-beans.jpg` | Roasted coffee beans |
| `gallery-10-counter.jpg` | The espresso bar / counter |

Want more or fewer? Duplicate (or remove) a `<figure class="gallery-item">` block in
the "ATMOSPHERE" section of `index.html`, and update this table to match — the
marquee needs no other changes.

Recommended: at least 1200px on the short side — these get a hover ripple effect, so
sharp detail helps.

## Why Stay (three editorial rows)
| Filename | Suggested shot |
|---|---|
| `benefit-work.jpg` | Someone working at a table, laptop + coffee, quiet corner |
| `benefit-family.jpg` | The kids' corner in use — toys, a parent nearby |
| `benefit-patio.jpg` | Outdoor patio seating, ideally at dusk with warm light |

## Our Story
| Filename | Suggested shot |
|---|---|
| `story-interior.jpg` | A dim, atmospheric corner of the room — tall/portrait crop (the frame is ~2:3) |

## Notes
- All images are loaded with `loading="lazy"` and `object-fit: cover` — any
  reasonable aspect ratio works, but match the "suggested shot" framing where noted
  so nothing gets awkwardly cropped.
- If a file is missing, the `<img>` quietly removes itself and the warm, dark gradient
  placeholder underneath stays visible — nothing ever shows a broken-image icon.
- The hero and gallery-hover WebGL effects (`js/main.js`) try to load these same
  files as GPU textures first, falling back to a matching procedural gradient if
  the file isn't there yet.
- Keep exposure **low-key throughout** — this design leans into the room's actual
  dim, cozy lighting rather than brightening it up. Overexposed, bright-white photos
  will fight the rest of the page.
