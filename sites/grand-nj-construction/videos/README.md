# Hero video

The hero is **scroll-driven**. It never autoplays. `.hero` is a tall scroll
track, `.hero__sticky` pins to the viewport, and scroll progress is mapped
straight onto `video.currentTime` — so the van moves exactly as fast as the
visitor scrolls and runs backwards when they scroll up. Hero text slides in
against it on the same scroll.

| File | Size | Used on |
|---|---|---|
| `hero-desk.mp4` | 1.43 MB | ≥900px, full-bleed |
| `hero-mob.mp4` | 0.44 MB | <900px, as a band |

Poster frames are `images/hero-poster-{640,960,1344}.{jpg,webp}`, taken from
frame 0 of the video itself so there is no jump when the video takes over.

## Encoding: why all-intra

Scrubbing means seeking on every frame. With a normal GOP the browser must
decode from the last keyframe on each seek and the picture stalls, so every
frame is a keyframe (`-g 1`).

Measured on this footage at 768x420, all-intra is also *smaller* than a short
GOP, because B-frames and reference overhead cost more than they save at this
length:

| GOP | CRF | Size |
|---|---|---|
| 1 | 32 | 747 KB |
| **1** | **36** | **451 KB** ← shipped |
| 2 | 32 | 885 KB |
| 3 | 32 | 700 KB |
| 5 | 32 | 568 KB |

15 fps, not 24: playback position comes from scroll, so the extra frames buy
nothing and cost a third of the file.

```
ffmpeg -i source.mp4 -an -vf "scale=768:420:flags=lanczos,fps=15" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 -crf 36 -preset slow \
  -movflags +faststart hero-mob.mp4
```

Desktop is the same recipe at `scale=1280:700` and `-crf 33`.

**No WebM.** VP9 all-intra came out at 7.8 MB against H.264's 2 MB on the same
footage — the codec is poor at this job. Every browser plays H.264.

## Three things that will break this

**The host must serve HTTP Range requests.** Without them `video.seekable.end(0)`
is 0, every seek silently lands on frame 0, and the hero looks frozen while
everything else works. This cost real debugging time here — Python's
`http.server` does not support ranges. Netlify, Cloudflare Pages, Vercel and
S3 all do.

**Seeks must be throttled through rAF.** Writing `currentTime` on every scroll
event floods the decoder and the picture stalls. `js/main.js` keeps a target
time and applies at most one seek per animation frame, only when it moved.

**iOS needs the video primed.** Safari will not decode or seek a video that has
never been told to play. The code calls `play()` then immediately `pause()`,
which unlocks seeking without the video ever running.

## Mobile is a band, not full-bleed

The footage is 1.83:1; a phone viewport is about 0.46:1. `object-fit: cover`
scales it 2x and crops away roughly three quarters of the width — the van
drives out of the visible frame entirely. Below 900px the video therefore sits
in its own band at native aspect (390x213 on a 390px phone), whole shot
visible, no upscaling, with the text below it on solid ground.

## Degradation

- **No JS** — the tall track and the sticky are both behind a `.js` class that
  is only added once GSAP has loaded. The video never gets a `src`. The page
  renders as an ordinary poster hero with all text visible.
- **prefers-reduced-motion** — video hidden, hero height reset to auto, all
  text at full opacity.
- **Save-Data** — same as reduced motion.
- **GSAP CDN unreachable** — falls back to `js/vendor/`, which is how this was
  tested, since cdnjs is blocked from the build environment.
- **Video 404 or decode failure** — the element removes itself and the poster
  stands.

## Superseded

Three earlier generated takes (Higgsfield, veo3_1_lite and wan3_0) are no
longer used; the client supplied real footage instead. Their prompts and job
IDs are in the git history of this file if they are ever wanted again.
