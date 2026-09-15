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

Each keeps its **native aspect ratio** — forcing the tall chimney shot into a
4:3 box wrecked it, and the staggered heights suit the coursing idea anyway.
The ratio is set inline per slot so the box is reserved before the image
arrives and nothing shifts.

**No siding or gutters photo yet.** Those two trades are described on the page
but not shown. One of each would complete the set.

## Sizing

Two widths, 480 and 800, in WebP with JPEG fallback. There is deliberately no
1284 variant: the slots render at ~300 CSS px on desktop and ~350 on phone, so
800w already covers 2× everywhere and a larger file would only ever be wasted
bytes.

Large variants are compressed harder than small ones (webp q40 at 800 vs q56 at
480). That looks backwards but isn't — a high-DPR screen shows those pixels
physically smaller, so it tolerates lower per-pixel quality.

Measured payload, in a real browser:

| | first view | + gallery (lazy) |
|---|---|---|
| desktop 1× | 121 KB | 265 KB |
| phone 2× | **84 KB** | 426 KB |
| phone 3× | 120 KB | 462 KB |

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
ffmpeg -i src.jpg -vf "scale=480:-2:flags=lanczos" -q:v 6 job-0N-480.jpg
ffmpeg -i src.jpg -vf "scale=480:-2:flags=lanczos" -quality 56 -compression_level 6 job-0N-480.webp
ffmpeg -i src.jpg -vf "scale=800:-2:flags=lanczos" -q:v 9 job-0N-800.jpg
ffmpeg -i src.jpg -vf "scale=800:-2:flags=lanczos" -quality 40 -compression_level 6 job-0N-800.webp
```
