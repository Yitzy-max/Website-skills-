# Images

Every slot here is a real `<picture>`/`<img>` with a reserved aspect-ratio box.
Drop a file in at the right name and it appears — no code change, no layout
shift, because the box is already the right shape.

## In place

| File | What it is |
|---|---|
| `van-still.jpg` / `.webp` | The company's own van photo, colour-graded (warmer, greener, slightly lifted). 1344×768. Doubles as the hero poster and the mobile hero. |

## Wanted

| File | Shown as | Notes |
|---|---|---|
| `job-01.jpg` | Chimney | 4:3, ideally 1600×1200 or better |
| `job-02.jpg` | Roofing | 4:3 |
| `job-03.jpg` | Siding | 4:3 |
| `job-04.jpg` | Masonry | 4:3 |

Until they land, each renders a woven-texture placeholder captioned
"Photo to come". It reads as deliberate rather than broken.

## Rules

- **The client's own photos only.** No stock, no competitor's photography, no
  AI-generated "finished jobs". A fabricated job on a contractor's own site is
  the single fastest way to lose the client's trust and the sale.
- Anyone recognisable in a photo needs to be an employee, or the photo doesn't
  go up.
- Shoot or crop to 4:3. Landscape. Real jobs beat pretty ones — a stained
  ceiling next to the repaired chimney sells better than a glamour shot.

## Regenerating the hero still

The grade applied to the raw van photograph:

```
ffmpeg -i van-raw.jpg \
  -vf "eq=brightness=0.035:saturation=1.42:contrast=1.10:gamma=1.03,\
colorbalance=rs=0.035:gs=0.012:bs=-0.045:rm=0.02:bm=-0.02,\
scale=-2:768:flags=lanczos,crop=1344:768" \
  -q:v 4 van-still.jpg
```
