# Images

All photographs here are the client's own. Two of the four job photos show the
company van — same phone number, same licence as the header — which is why they
carry weight that stock never could.

## Hero

`van-still-{640,960,1344}.{jpg,webp}` — their van, colour-graded warmer and
greener from the original overcast shot. Also the start frame fed to the video
generator, so the video and the poster are the same image.

## The work

| Slot | Photo | Caption | Native ratio |
|---|---|---|---|
| `job-01` | Chimney liner and cap through new decking | Chimney cap and liner | 1284×1330 (cropped) |
| `job-02` | Full roof replacement, crew on a colonial | Full roof replacement | 1284×956 |
| `job-03` | Roof stripped to deck, van in the driveway | Tear-off to the deck | 1284×1368 |
| `job-04` | Front steps broken out for rebuild | Front steps, mid-rebuild | 1284×974 |
| `job-05` | Freshly poured sidewalk and curb, taped off | Sidewalk and curb, curing | 1284×1654 |

All five are cropped to a **uniform 4:3** at the client's request, so every
frame in the grid is identical (395x296 desktop, 350x263 phone). The crop
offset is chosen per photo so the subject survives — the chimney frame starts
at y=300 to keep the flue top and the cap, the tear-off at y=250 to keep the
van in shot.

They are also exposure-matched. Straight off the phone their mean luminance
ran from 97 to 150, which is why they didn't read as a set; each now carries
its own brightness offset onto a common target, then a shared grade
(saturation 1.18, contrast 1.07) and a light unsharp pass. Spread is down from
53 to 3.

**No siding or gutters photo yet.** Both trades are described on the page but
not shown, and that is the honest state — the gallery does not need one image
per trade. `job-05` was supplied as "siding" but is concrete flatwork; it is
captioned for what it actually is and sits with the masonry work.

Do NOT fill the gutter slot with a generated image. A synthetic photo of gutter
work among real job photos reads as a job they did, which is fabricated proof,
and the owner would know instantly that he never did it. Either get a real
photo or show nothing.

## Sizing

Two widths, 480x360 and 800x600, in WebP with JPEG fallback. There is
deliberately no larger variant: the slots render at ~395 CSS px on desktop and
~350 on phone, so 800w already covers 2x everywhere and anything bigger is
wasted bytes.

Large variants are compressed harder than small ones (webp q40 at 800 vs q56 at
480). That looks backwards but isn't — a high-DPR screen shows those pixels
physically smaller, so it tolerates lower per-pixel quality.

Measured payload, in a real browser:

| | first view | + gallery (lazy) |
|---|---|---|
| desktop 1x | 121 KB | 293 KB |
| phone 2x | **84 KB** | 501 KB |
| phone 3x | 120 KB | 537 KB |

The gallery is five full-size job photographs and loads only once scrolled to;
the number that matters for first impression is the 84 KB above the fold.

## Two traps worth remembering

**Never hide a lazy image with `display:none`.** The placeholder state used to
do that, which deadlocks: a `display:none` image never loads, so `onload` never
fires, so the placeholder never clears. The gallery would have shipped
permanently blank. Placeholders now fade via `opacity` so the image stays in
layout and loads normally.

**Don't put `poster=` on the hero video.** The `<img>` behind it already is the
poster, and the attribute pulled the full-size JPEG a second time on every
single page load — 220 KB of pure waste.

## Rules for new photos

- The client's own work only. No stock, no competitor's photography, no
  AI-generated "finished jobs".
- Anyone recognisable must be an employee.
- Landscape or portrait both fine — the grid takes native ratios. Add the real
  pixel dimensions to the slot's inline `aspect-ratio` when you drop one in.

## Regenerating

```
# gallery slot, both widths
# 1. crop to 4:3, picking OFFSET so the subject stays in frame
ffmpeg -i src.jpg -vf "crop=1284:963:0:OFFSET" -q:v 3 crop.jpg

# 2. measure mean luminance, pick BRIGHT to land near 122 (0.1 ~= +25 levels)
# 3. grade to match the set, then resize
ffmpeg -i crop.jpg -vf "eq=brightness=BRIGHT:saturation=1.18:contrast=1.07:gamma=1.02,unsharp=5:5:0.75:5:5:0.0" -q:v 2 graded.jpg

ffmpeg -i graded.jpg -vf "scale=480:360:flags=lanczos" -q:v 5 job-0N-480.jpg
ffmpeg -i graded.jpg -vf "scale=480:360:flags=lanczos" -quality 62 -compression_level 6 job-0N-480.webp
ffmpeg -i graded.jpg -vf "scale=800:600:flags=lanczos" -q:v 9 job-0N-800.jpg
ffmpeg -i graded.jpg -vf "scale=800:600:flags=lanczos" -quality 38 -compression_level 6 job-0N-800.webp
```
