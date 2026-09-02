# Hero video

The hero section (`index.html` → `.hero-video`) expects a video at:

```
videos/hero-steam.mp4
```

If the file isn't there, the `<video>` element quietly hides itself and the site
falls back to the WebGL ambient crossfade in `js/main.js` (see `images/README.md`
for the stills it uses) — nothing breaks either way.

## Suggested concept

The brand name is the whole idea: steam rising off a cup, lit like it's catching a
shaft of light through a dim room — "a little heaven" made literal for a few seconds,
then the camera settles into the actual space. Something like:

> Extreme macro, a shot of espresso settling in a dark ceramic cup on a worn wood
> table. A slow wisp of steam curls upward, catching a soft warm shaft of light from
> off-frame, like sunlight through a window in a dim room. Very slow, smooth push-in
> on the steam and light. Around mid-clip, the camera pulls back and gently rises,
> revealing — softly out of focus at first, then resolving — a dim, warm coffee shop
   interior: pendant lights, wood tables, someone reading in a quiet corner, a hint of
  a kids' play corner in the background. Low-key cinematic lighting throughout, deep
  warm shadows, no harsh highlights. Minimal camera shake, no exaggerated motion,
  shot like a quiet arthouse coffee commercial. Generous open, dark negative space in
  the upper third for text overlay. No text, no logos, no watermarks, no UI, no
  visible faces.

Aim for 10-14 seconds, looping, silent (autoplay muted loop), 16:9, 1080p if the plan
allows it. `object-fit: cover` in `css/style.css` (`.hero-video`) keeps it filling the
hero regardless of the visitor's screen size/aspect ratio.

## Generating it

This environment has the Higgsfield MCP tools (`generate_video` /
`generate_video_batch`) available for exactly this kind of generation. This build
didn't render a hero video: this session's network policy blocks the CDN Higgsfield
hosts renders on (`*.cloudfront.net`), so a clip generated here couldn't actually be
downloaded into this `videos/` folder — the render would exist, but there'd be no way
to pull it into the repo without a manual download step outside this session. If you
generate one yourself (here or in a session with a different network policy), drop
the result in as `hero-steam.mp4` and refresh — no code changes needed.

## Notes
- Keep it silent (no generated audio) and encode for `autoplay muted loop
  playsinline` — required for autoplay to work in every major browser.
- Compress well (H.264, target well under 5MB for a ~12s loop) — the hero should
  still feel instant on a phone connection.
