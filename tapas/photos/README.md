# Source photos for the hero

The hero scrubs a frame sequence built from these, in filename order.
`01`–`04` are the original phone shots: wings, nachos, tacos, sliders.

## Rebuilding the frames

    npm run frames:stills ./photos

That rewrites `public/frames/tapas/` (both sizes plus the poster) and updates
`lib/frames-manifest.json`. Nothing else needs editing.

If you shoot video instead — which scrubs far better than stills, because the
motion is real rather than a slow crop — use:

    npm run frames -- path/to/clip.mp4

## Swapping in the black-plate versions

The four dishes were re-plated onto a matte black plate with Higgsfield
(gpt_image_2, 2048×1360). They live in the Higgsfield gallery for this
account. This build environment blocks the Higgsfield CDN, so they could not
be pulled in from here — download them yourself, then:

1. Save them over `01.jpg` … `04.jpg`, keeping wings / nachos / tacos /
   sliders in that order. (`.png` works too; the script accepts both.)
2. Run `npm run frames:stills ./photos`.

Order matters: the `steps` array in `components/tapas-hero.tsx` gives each
dish a fixed quarter of the scroll, so a photo in the wrong slot means a card
describing the wrong plate.

## Changing how many photos

If you add or remove photos, update `steps` in `components/tapas-hero.tsx` so
the `from`/`to` ranges still divide 0→1 evenly between them. With five photos
the boundaries are 0.2 / 0.4 / 0.6 / 0.8.
