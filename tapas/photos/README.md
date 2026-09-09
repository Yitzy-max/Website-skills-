# Source photos for the hero

The hero scrubs a frame sequence built from these, in filename order.
Add or replace photos here, keeping the numbering, then run:

    npm run frames:stills ./photos

That rewrites `public/frames/tapas/` and updates `lib/frames-manifest.json`.

If you shoot video instead (which scrubs far better than stills), use:

    npm run frames -- path/to/clip.mp4

**When you change the number of photos, update the `steps` array in
`components/tapas-hero.tsx`** — each step's `from`/`to` has to line up with
where the sequence cuts to the next dish, or a card will describe the wrong
plate.
