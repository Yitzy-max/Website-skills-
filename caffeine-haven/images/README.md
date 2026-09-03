# Photos — drop-in slots

Every image on the page works from a built-in procedural fallback, so nothing
ever looks broken. The moment you drop a real file here with the **exact name**
below, it snaps into place — no code changes.

Recommended: JPG, ~1600px on the long side, compressed to ~300–500KB.

## Hero
| Filename | Where it shows |
|---|---|
| `hero-bg.jpg` | Full-bleed hero background (a moody milk-pour / latte shot works best — dark, with the pour on the right so the headline stays readable on the left) |

## Hero cards (the sliding coffee showcase)
These upgrade the four cards on the right of the hero. Square-ish crops read best.
`drink-hot-coffee.jpg` isn't wired to the cards yet — the cards use the marquee
slots below; to photo-back a specific card, add a `data-img` to it in `index.html`.

## Marquee (coffees & pastries under the hero)
| Filename | Item |
|---|---|
| `drink-iced-latte.jpg` | Iced Vanilla Latte |
| `drink-cortado.jpg` | Cortado |
| `pastry-blueberry.jpg` | Blueberry Muffin |
| `drink-cappuccino.jpg` | Cappuccino |
| `drink-cold-brew.jpg` | Cold Brew |
| `pastry-cinnamon.jpg` | Cinnamon Roll |
| `drink-matcha.jpg` | Iced Matcha |
| `drink-mocha.jpg` | Mocha |
| `pastry-fritter.jpg` | Apple Fritter |
| `drink-flat-white.jpg` | Flat White |

## The Space (gallery mosaic)
| Filename | Suggested shot |
|---|---|
| `space-counter.jpg` | The counter / barista (your photo of the girl behind the counter is perfect here) |
| `space-room.jpg` | The back room / seating |
| `space-latte.jpg` | A latte close-up |
| `space-outside.jpg` | Sidewalk seating |
| `space-pastries.jpg` | The pastry case |

## Notes
- Missing files silently keep the procedural fallback — no broken-image icons.
- All slots use `object-fit: cover`, so any reasonable crop works.
