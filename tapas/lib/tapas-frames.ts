import manifest from "./frames-manifest.json";

/**
 * Frame-sequence config for the Tapas hero.
 *
 * The hero scrubs an ordered image sequence as you scroll — the same technique
 * Apple uses. It needs numbered frames, not loose photos. Drop a video in and
 * run `npm run frames` (see scripts/make-frames.sh); that script writes the
 * frames AND updates lib/frames-manifest.json, so nothing here needs editing
 * by hand.
 *
 * Until real frames exist, `count` is 0 and the hero shows the poster instead
 * of a broken sequence.
 */

/** Frames written by scripts/make-frames.sh. 0 = none uploaded yet. */
export const FRAME_COUNT = manifest.count;

/** Full-size frames, used on tablet and desktop. */
export const DESKTOP_DIR = "/frames/tapas/1440";

/** Half-width frames, used on phones. */
export const MOBILE_DIR = "/frames/tapas/720";

/** Shown when there are no frames yet, on slow connections, and under
 *  prefers-reduced-motion. */
export const POSTER = "/frames/tapas/poster.jpg";

/**
 * On phones we play every Nth frame from the smaller directory. Frames are the
 * whole payload of this hero, so this is the single biggest mobile win: half
 * the pixels per frame, a third as many frames.
 *
 * Only worth doing on a real sequence — a short set of stills has no frames to
 * spare, so it plays in full on every device.
 */
export const MOBILE_STRIDE =
  FRAME_COUNT > 120 ? 3 : FRAME_COUNT > 60 ? 2 : 1;

const pad = (i: number) => String(i).padStart(4, "0");

/** framePath for desktop: 1 → /frames/tapas/1440/frame_0001.jpg */
export const desktopFrame = (i: number) => `${DESKTOP_DIR}/frame_${pad(i)}.jpg`;

/**
 * framePath for phones. The hero asks for frame 1..ceil(count/stride); we map
 * that onto every Nth real frame so the sequence still covers the full shot.
 */
export const mobileFrame = (i: number) => {
  const real = Math.min(FRAME_COUNT, (i - 1) * MOBILE_STRIDE + 1);
  return `${MOBILE_DIR}/frame_${pad(real)}.jpg`;
};

export const mobileFrameCount = () =>
  FRAME_COUNT > 0 ? Math.ceil(FRAME_COUNT / MOBILE_STRIDE) : 0;
