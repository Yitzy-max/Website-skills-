# The frame sequence

## What this folder is

The hero animation is a **scroll-scrubbed image sequence**. It is not a set of
objects being moved around with CSS — there is no "laptop #1" element to swap
for a plate. The original MacBook hero is a rendered video that was exported to
941 numbered JPGs, and scrolling just steps through them one frame at a time.

That's why the conversion works the way it does: the engine stays exactly as it
was, and the *sequence* becomes food. Same scrub, same easing, same timing, same
step windows — different frames.

Until the tapas frames exist, `js/hero.js` runs on the original reference
sequence so the motion can be reviewed with real assets in place.

## Dropping the tapas frames in

1. Put the numbered files in this folder: `frame_0001.jpg` … `frame_0941.jpg`
   (zero-padded to 4 digits).
2. Open `js/hero.js` and set:

   ```js
   const SEQUENCE = {
     count: 941,        // however many frames you actually rendered
     eagerCount: 140,   // frames loaded before the loader clears
     useLocal: true,    // <- flip this
   ```

Nothing else changes. A missing frame won't break anything — the loader counts
errors as loaded on purpose, so a gap shows the previous frame and the scroll
keeps working.

## Producing the frames

**Step 1 — the dish photos.** Their real plates, one clean shot per dish. Shot
on a plain surface if possible; the background gets replaced anyway.

**Step 2 — put every dish on the same plate (Higgsfield).** This is what keeps
the sequence from looking like a collage. Upload each photo, then generate with
the same plate and the same light every time, changing only the food:

> Overhead studio shot of {dish} on a plain matte white ceramic plate, warm
> ivory seamless background, soft diffused light from the upper left, single
> soft shadow, no props, no cutlery, no hands, photographic, shallow depth of
> field.

Use the food photo as the reference/input image so it stays *their* dish, not a
generated one. Keep the plate, background, light direction and camera angle
wording identical across all of them.

**Step 3 — turn the stills into motion.** Feed each normalised plate into
Higgsfield image-to-video and render a slow move — a rise, a turn, or a push in.
Whatever the motion is, it has to be **continuous across the cut** so the
sequence reads as one shot, the way the MacBook video does.

**Step 4 — export to frames.**

```bash
ffmpeg -i dish-sequence.mp4 -vf "scale=1400:-1" -q:v 4 frame_%04d.jpg
```

At 30fps a 31-second render gives ~941 frames. Fewer is fine — just set `count`
to match. Shorter sequences scrub faster per pixel of scroll; if it feels quick,
raise the spacer height in `index.html` (`style="height:600vh"`).

## Framing the shot

The headline sits across the top of the stage and the cards sit bottom-left, so
leave the plate room:

- Portrait or square, around 1400px wide.
- Food centred, with clear space in the top third and bottom-left corner.
- Same ivory background as the page (`#FBF8F3`) so the frame edge disappears.

Keep the files reasonably small — ~40-130KB each is what the reference sequence
runs at. 941 frames at 300KB is a 280MB hero, and nobody waits for that.
