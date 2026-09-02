# Hero video (optional — the hero doesn't need this)

The hero currently uses a **built illustration**, not a video or photo: cups and
pastries (inline SVG, defined at the top of `index.html`) drop in and settle onto a
lit counter (`js/main.js` → `heroSpread()`), styled after a reference photo of the
shop's own drinks and baked goods. It works with zero external assets and has no
network dependency beyond the GSAP/Lenis CDNs the rest of the site already uses.

This folder — and a real hero video — is an optional future upgrade, not a
requirement.

## If you want to add one later

A short, silent, looping clip could replace or sit behind the illustrated spread.
The strongest concept for this brand is the literal thing the shop sells: a slow,
handheld-feeling pass across the counter — steam off a cup, a muffin being set down,
the espresso machine in the background — ending on a wide shot of the room. Keep it
low-key/dim to match the rest of the site; a bright, evenly-lit shot will fight the
page's palette.

Technical notes if you do add `videos/hero-counter.mp4` and wire it back into
`index.html`:
- Silent, `autoplay muted loop playsinline` (required for autoplay in every major
  browser).
- H.264, well under 5MB for a ~10-12s loop, 16:9.
- Give the `<video>` an `onerror` fallback so a missing/broken file doesn't break the
  page — see how `.hero-godrays`/`.hero-spread` are set up as the always-available
  base layer.

This environment's network policy also blocks the CDN that AI video-generation tools
here render to (`*.cloudfront.net`), so a clip generated in a session like this one
can't be downloaded straight into the repo — it would need a manual download step
outside this session, or a different network policy.
