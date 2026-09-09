/**
 * Build the hero's frame sequence from a folder of photos.
 *
 *   node scripts/stills-to-frames.mjs ./photos
 *
 * The hero scrubs an ordered sequence as you scroll, so a handful of stills
 * would land as a handful of hard cuts. This turns each photo into a slow
 * push-in — a run of frames that crop progressively tighter — so scrolling
 * reads as movement and each dish still gets its own moment.
 *
 * Photos are used in filename order, so name them 01, 02, 03... to control it.
 * Desktop frames are landscape, phone frames are cropped portrait: a phone is
 * a tall window, and letting object-fit shave the sides off a landscape frame
 * throws away most of the plate.
 *
 * For real video footage use scripts/make-frames.sh (ffmpeg) instead.
 */
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = process.argv[2];
const ROOT = path.resolve(import.meta.dirname, "..");
const BIG = path.join(ROOT, "public/frames/tapas/1440");
const SMALL = path.join(ROOT, "public/frames/tapas/720");

/** Frames per photo. More = smoother scrub, linearly more bytes. */
const PER_PHOTO = Number(process.env.PER_PHOTO ?? 24);
/** How far each photo pushes in over its run, as a fraction of the frame. */
const ZOOM = 0.12;

const BIG_W = 1440;
const BIG_H = 810; // 16:9 for landscape viewports
const SMALL_W = 640;
const SMALL_H = 960; // 2:3 for phones

if (!SRC) {
  console.error("usage: node scripts/stills-to-frames.mjs <photo-folder>");
  process.exit(1);
}

const files = (await readdir(SRC))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error(`no images found in ${SRC}`);
  process.exit(1);
}

await rm(BIG, { recursive: true, force: true });
await rm(SMALL, { recursive: true, force: true });
await mkdir(BIG, { recursive: true });
await mkdir(SMALL, { recursive: true });

const pad = (i) => String(i).padStart(4, "0");

/**
 * Crop a centred window that shrinks as `t` goes 0 → 1, then resize it to the
 * output box. Shrinking the source window is what produces the push-in.
 */
async function frame(src, meta, t, outW, outH, outPath, quality) {
  const scale = 1 - ZOOM * t;
  const targetRatio = outW / outH;

  // Largest window of the requested shape that fits inside the source.
  let winW = Math.min(meta.width, meta.height * targetRatio);
  let winH = winW / targetRatio;

  winW = Math.round(winW * scale);
  winH = Math.round(winH * scale);

  const left = Math.round((meta.width - winW) / 2);
  const top = Math.round((meta.height - winH) / 2);

  await sharp(src)
    .extract({ left, top, width: winW, height: winH })
    .resize(outW, outH, { fit: "fill" })
    .jpeg({ quality, mozjpeg: true })
    .toFile(outPath);
}

let n = 0;
for (const file of files) {
  const src = path.join(SRC, file);
  const meta = await sharp(src).metadata();

  for (let k = 0; k < PER_PHOTO; k++) {
    const t = PER_PHOTO === 1 ? 0 : k / (PER_PHOTO - 1);
    n += 1;
    const name = `frame_${pad(n)}.jpg`;
    await frame(src, meta, t, BIG_W, BIG_H, path.join(BIG, name), 74);
    await frame(src, meta, t, SMALL_W, SMALL_H, path.join(SMALL, name), 62);
  }
  console.log(`${file} → ${PER_PHOTO} frames`);
}

// First frame doubles as the still shown on save-data and reduced-motion.
await sharp(path.join(SRC, files[0]))
  .resize(1440, 810, { fit: "cover" })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(path.join(ROOT, "public/frames/tapas/poster.jpg"));

await writeFile(
  path.join(ROOT, "lib/frames-manifest.json"),
  JSON.stringify(
    {
      count: n,
      note: "Written by scripts/stills-to-frames.mjs. 0 means no frames uploaded yet.",
    },
    null,
    2
  ) + "\n"
);

console.log(`\n${n} frames from ${files.length} photos`);
