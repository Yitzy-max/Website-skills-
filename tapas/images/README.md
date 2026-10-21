# Photos

## Hero — installed, live on the page

| File | Size | Used for |
|---|---|---|
| `hero.jpg` | 1536x1024 (3:2), 401 KB | Screens wider than 900px |
| `hero-mobile.jpg` | 1200x1200 (1:1), 294 KB | Phones |

**Two crops, not one image scaled.** The wide frame cover-cropped into a
9:19.5 phone screen would keep a narrow vertical strip through the middle of
the board and throw away the dishes around the edge — which is the whole
subject. `<picture>` picks between them on `(max-width: 900px)`, in markup, so
the right one is chosen before any JavaScript runs.

On a phone the square frame is shown **whole**, in a square band under the
header, rather than cropped to fill. Whatever the band doesn't cover is the
same photo thrown far out of focus behind it, so the sharp square reads as a
frame set into a field instead of a picture sitting in a hole.

Scroll drives a slow push-in (scale 1 → 1.09) and stages the copy in over it.
It is scrubbed, not animated: at rest the picture is perfectly still and only
moves while the visitor does.

### Replacing them

Any aspect ratio works for the desktop file — it's cover-cropped. Keep the
phone file square, or the band and the copy below it stop lining up (the CSS
positions the copy at `11% + 100vw`, which is where a square ends).

```
ffmpeg -i WIDE.png   -vf "scale=1536:-2:flags=lanczos" -q:v 6 hero.jpg
ffmpeg -i SQUARE.png -vf "scale=1200:-2:flags=lanczos" -q:v 6 hero-mobile.jpg
```

`-q:v 6` was chosen by comparing crops against `-q:v 3`: no visible difference
at full-bleed size, 40% fewer bytes. Don't go past 8 — the board has a lot of
fine texture (sesame seeds, herb flecks, grill char) and it blocks up fast.

## Plate cards — still empty

The three cards in "In the spotlight" are wired to these filenames. Drop the
files in and refresh; there are no code changes.

| Save it as | Dish |
|---|---|
| `plate-short-rib-cigars.jpg` | Short Rib Cigars |
| `plate-brisket-nachos.jpg` | BBQ Brisket Nachos |
| `plate-mango-habanero-poppers.jpg` | Mango Habanero Poppers |

Portrait crops work best — the cards are roughly 2:3. Until the files exist
each card falls back to the dish's initial over a warm dark ground, which
looks deliberate rather than broken, but real photos land much harder.
