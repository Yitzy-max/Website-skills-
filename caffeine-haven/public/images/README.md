# Local image hosting (optional)

By default this site hotlinks the generated brand photography from
Higgsfield's media CDN (see `CDN` / `GALLERY_IMAGES` at the top of
`src/main.js`). That's the fastest way to ship, but it means the images
live on someone else's infrastructure.

To self-host instead:
1. Download each URL in `GALLERY_IMAGES` (and the hero video) to this
   folder — keep the `.webp` format for the small file size, or convert.
2. Update `GALLERY_IMAGES` in `src/main.js` to local paths, e.g.
   `/images/gallery-01.webp`.
3. Do the same for `HERO_VIDEO` → `public/video/hero.mp4`.

Vite serves everything under `public/` from the site root automatically.
