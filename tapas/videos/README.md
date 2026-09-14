# Hero video

**Installed.** The files in this folder are live on the page.

| File | Size | Used for |
|---|---|---|
| `hero.mp4` | 2.4 MB | 1280x720, screens wider than 900px |
| `hero-mobile.mp4` | 1.1 MB | 854x480, phones |
| `hero-poster.jpg` | 58 KB | Last frame: shown whenever the scrub is off |
| `hero-poster-mobile.jpg` | 32 KB | Same, phone size |

Both files are the same 16:9 cut. Phones get a smaller encode, not a
different crop — see "Why phones see the whole frame" below.

## What the footage is

A locked-off camera on a concrete surface. Dishes arrive one at a time from
the side, settle, and slide out again: brisket nachos, honey buffalo poppers,
brisket tacos on a board, sliders with fries. Shallow depth of field, soft key
light, no hands, no people, no text.

The clip is trimmed to start **0.62s in**, so the very first frame is already
a plate most of the way into shot. Untrimmed it opens on an empty slab, which
is what a visitor who never scrolls would have been left looking at.

## Scroll is the transport

The hero video **never plays on its own**. Scroll position drives
`currentTime`, so each dish lands as the visitor scrolls, and the copy arrives
with it: the headline once the first plate is down, then the kosher / BYOB /
Route 9 line and the call button once the second is.

That is also why the food does not shimmer. Scrubbed, the visitor is looking
at a single held frame whenever they are not actively scrolling. A temporal
denoise pass (`atadenoise=s=17`) takes the edge off the rest, and the page
lays a fixed film-grain field over the footage in CSS. Grain is what makes it
read as photographed rather than rendered — and doing it in CSS rather than
baking it into the video matters, because baked-in grain cost 1.8 MB.
The grain is static, never animated: nothing in this hero moves unless the
visitor scrolls.

Stronger denoising was tried and rejected on an earlier render: `s=49` plus
`vaguedenoiser` ghosted the moving plates, which is worse than the shimmer.
Stabilizing out camera motion was tried and made frame-to-frame churn worse,
not better.

### This needs HTTP Range support

Scrubbing means seeking, and seeking needs the host to answer range requests.
GitHub Pages, Netlify, Vercel, S3 and every normal static host do.
`python -m http.server` does **not** — it ignores `Range` and returns the whole
file, so seeking silently fails there.

The page handles that itself: it performs a test seek before committing to the
scrub, and if the seek does not land it drops to a plain one-screen hero
showing the poster with all the copy already visible. Nothing looks broken;
you just lose the scroll effect. So if the scroll animation is missing on a
given host, that host is not serving ranges.

## Why phones see the whole frame

A phone screen is 9:19.5 and the film is 16:9. Cropping it to fill blows the
dishes up and slices the sides off — and the dishes enter from the sides, so a
crop loses the whole point of the shot. On phones the frame is shown whole
instead, in a 16:9 band under the header: smaller plates, entire composition,
nothing cut.

Whatever the band does not cover is not flat black. It is the same poster
frame thrown far out of focus (`blur(38px)`, pulled down to 36% brightness),
so the sharp band reads as a frame set into a field rather than a video in a
hole — and when the hero scrolls away there is no dead panel behind it.

## How the hero decides what to show

1. Data saver on, or a 2g connection → no video at all, the poster stands in.
2. Screen <=900px → `hero-mobile.mp4`.
3. Otherwise → `hero.mp4`.

The poster is painted by CSS *underneath* the video, so the frame is never
empty: not while the video downloads, not if autoplay is blocked, not with
JavaScript off. The video also pauses whenever it scrolls out of view or the
tab is hidden, so it isn't burning a phone battery in the background.

`reduce motion` skips the video and shows the poster.

## Re-encoding, if the render is ever replaced

```
# desktop
ffmpeg -ss 0.62 -i RAW.MP4 -an \
  -vf "crop=824:464:12:0,atadenoise=s=17,scale=1280:720:flags=lanczos,\
unsharp=5:5:0.45:5:5:0.0,eq=saturation=0.95,setsar=1,fps=24" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -preset slow \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart hero.mp4

# phone: same cut, smaller
ffmpeg -ss 0.62 -i RAW.MP4 -an \
  -vf "crop=824:464:12:0,atadenoise=s=17,scale=854:480:flags=lanczos,\
unsharp=5:5:0.3:5:5:0.0,eq=saturation=0.95,setsar=1,fps=24" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 25 -preset slow \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart hero-mobile.mp4

# posters: the last held frame of each
ffmpeg -sseof -0.15 -i hero.mp4        -frames:v 1 -q:v 4 hero-poster.jpg
ffmpeg -sseof -0.15 -i hero-mobile.mp4 -frames:v 1 -q:v 5 hero-poster-mobile.jpg
```

Four things in there are load-bearing:

- `-g 8 -keyint_min 8 -sc_threshold 0` puts a keyframe every 8 frames. Dense
  keyframes are what make seeking feel instant; at default spacing, scrubbing
  stutters. It is also why these files are bigger than a plain autoplay cut.
- `-movflags +faststart` moves the index to the front of the file so playback
  can start before the whole thing has downloaded.
- `crop=824:464:12:0` trims the source to an exact 16:9. The source is
  848x464, which is 53:29 — close to 16:9 but not it, and the mismatch shows
  as a hairline letterbox against the CSS.
- `-an` drops the audio. The source carried a track; the hero is silent.

`scale=...:flags=lanczos` plus a light `unsharp` is doing real work on the
desktop file: the source is 848 wide and the desktop hero is full-bleed, so
something has to upscale it. Lanczos with a touch of sharpening is visibly
crisper than leaving the browser to scale it bilinearly.

## Source quality

The file this was cut from is **848x464 at 1.6 Mbps** — a re-compressed copy,
not the 2560x1440 master the model produced. That is the ceiling on how sharp
the desktop hero can look. If the full-size master can be re-downloaded
(right-click -> Save As on a computer, rather than sharing it off a phone),
re-running the two commands above against it is a straight upgrade with no
other changes needed.
