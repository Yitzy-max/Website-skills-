# Photography needed

This page is built to be **image-forward** — the design's only job is to frame The
Caffeine Haven's own photography, so it needs the real thing before launch. Every slot
below already works with a soft procedural placeholder tuned to the brand's dark,
low-lit palette (so the page never looks broken), and upgrades automatically the
moment the matching file is dropped in — no code changes needed.

Note: the **hero** no longer needs photography — it uses a built illustration (cups
and pastries dropping onto a lit counter, see `index.html`'s inline SVG symbols and
`js/main.js`'s `heroSpread()`), based on a reference photo of the shop's own drinks
and baked goods. Swapping in real hero photography/video later is still possible (see
`videos/README.md`) but isn't required.

Drop files into this folder using these **exact filenames**:

## Atmosphere carousel ("The Room" section)
A horizontal, auto-sliding strip — 10-12 small cards work well. Mix close-up drinks
and pastries with a couple of room/storefront/kids'-corner shots. Portrait crop
(roughly 4:5) reads best.

| Filename | Used for |
|---|---|
| `gallery-01-latte-art.jpg` | A flat white / latte art close-up |
| `gallery-02-interior-wide.jpg` | Wide shot of the main room |
| `gallery-03-pastry-case.jpg` | The pastry case — muffins, buns |
| `gallery-04-reading-nook.jpg` | A quiet reading corner |
| `gallery-05-kids-corner.jpg` | The kids' corner with toys |
| `gallery-06-board-games.jpg` | Board games out on a table |
| `gallery-07-pour-over.jpg` | A coffee being brewed |
| `gallery-08-storefront.jpg` | The storefront on Main Street |
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
| `benefit-games.jpg` | A board game out on a table, mid-afternoon light |

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
- The atmosphere gallery's hover-ripple effect (`js/main.js`) tries to load these same
  files as a GPU texture first, falling back to a matching procedural gradient if the
  file isn't there yet.
- Keep exposure **low-key throughout** — this design leans into the room's actual
  dim, cozy lighting rather than brightening it up. Overexposed, bright-white photos
  will fight the rest of the page.
