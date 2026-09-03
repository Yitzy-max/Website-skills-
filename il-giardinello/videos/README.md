# Hero video

The hero section (`index.html` → `.hero-video`) expects a video at:

```
videos/hero-table.mp4
```

If the file isn't there, the `<video>` element quietly hides itself and the
site falls back to the existing WebGL ambient crossfade — nothing breaks.

## Getting the generated video into place

I generated this with the Higgsfield MCP (`seedance_2_0_mini`, 16:9, 12s,
720p, silent, no reference images — this account's plan didn't support the
higher-tier `seedance_2_5` model or 1080p). The render is hosted here:

**https://d8j0ntlcm91z4.cloudfront.net/user_3IkRZvhQJHVYjmx5uflJWyvBjWO/hf_20260902_002513_bd270e3f-54f6-4658-9cfa-2435511dfea1.mp4**

I couldn't download it myself — this environment's network policy blocks
that CDN the same way it blocks the restaurant's own site — so:

1. Open that link in a browser (or right-click → Save As) and download the `.mp4`.
2. Rename it to `hero-table.mp4` and drop it in this `videos/` folder.
3. Refresh the page — the hero video takes over automatically, no code changes needed.

## Prompt used

> Extreme overhead top-down shot, camera pointing straight down at a round
> dining table draped in a premium linen tablecloth in warm ivory, soft
> natural folds, fine woven texture. Low-key cinematic lighting, deep warm
> shadows, warm amber rim light grazing the fabric folds. Table begins
> almost empty. Very slowly and smoothly, one elegant Italian dish at a time
> glides into frame from different edges with gentle realistic momentum —
> first a plate of fresh hand-rolled pasta with a light wisp of steam
> curling upward, then an artisan wood-fired pizza, then a glass of red wine
> and a sprig of basil. Each object decelerates naturally as it settles,
> casting soft natural shadows. Tablecloth breathes with subtle slow
> movement. Shot like a luxury restaurant film, minimal, realistic, no
> exaggerated motion. Very slow, almost imperceptible macro camera push-in
> throughout, ideal for a scroll-scrubbed sequence. Generous open negative
> space along the left and right thirds of the frame for text overlay. No
> text, no logos, no watermarks, no UI, no hands, no people.

## If you want a re-render at higher quality

This account is on the "starter" workspace plan, which only unlocks the
budget video models. `seedance_2_5` (the model this was originally attempted
with, for a longer 14s / 1080p cut) requires a **Plus** plan or higher. If
you upgrade, tell me and I'll re-generate at the higher tier with the same
prompt.

## Notes

- The video is silent (`generate_audio: false`) and set to `autoplay muted
  loop playsinline` — required for autoplay to work in every major browser.
- `object-fit: cover` in `css/style.css` (`.hero-video`) keeps it filling
  the hero regardless of the visitor's screen size/aspect ratio.
- This was generated as a continuously-looping ambient background, not a
  frame-by-frame scroll-scrubbed sequence — true scroll-scrubbing needs a
  video encoded/seeked frame-by-frame against scroll position, which is a
  materially bigger build (and wasn't confirmed after the brief mixed both
  asks). Say the word if you actually want that version instead of a
  standard autoplay loop.
