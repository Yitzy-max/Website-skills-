# Hero video

**Installed.** The files in this folder are live on the page.

| File | Size | Used for |
|---|---|---|
| `hero.mp4` | 2.3 MB | 16:9, screens wider than 900px |
| `hero-mobile.mp4` | 1.0 MB | **4:5 portrait crop**, phones |
| `hero-poster.jpg` | 106 KB | The finished table: shown whenever the scrub is off |
| `hero-poster-mobile.jpg` | 45 KB | Same, portrait |

**The phone file is a different crop, not a smaller copy.** A 16:9 frame
cover-cropped into a 9:19.5 phone screen shows a narrow vertical sliver —
mostly empty tablecloth with the plates sliced off, and you cannot tell what
the food is. `hero-mobile.mp4` is cropped to 4:5 off the middle of the table
(`crop=576:720:352:0`) and sits in a panel of matching shape, so almost
nothing is lost.

The mp4s are larger than a plain autoplay cut would be because they carry a
keyframe every 8 frames (`-g 8`). Dense keyframes are what make seeking feel
instant; with the default spacing, scrubbing stutters.

The raw Higgsfield render was **18.9 MB at 18.8 Mbps** — an absurd bitrate for
720p and completely unusable on cell data. It is re-encoded above at a sane
bitrate with no visible quality loss, and dropped from the working tree (git
history still has it; so does Higgsfield).

## Scroll is the transport

The hero video **never plays on its own**. Scroll position drives
`currentTime`, so each plate lands as the visitor scrolls, and the copy
arrives with it: the headline once the first plate is down, then the kosher /
BYOB / Route 9 line and the call button once the second is.

That is also the fix for the food shimmering. Generated video regenerates the
food texture every frame, so on an autoplaying loop the food appears to crawl.
Scrubbed, the visitor is looking at a single held frame whenever they are not
actively scrolling, so it sits still. A temporal denoise pass
(`atadenoise`, ~30% less frame-to-frame churn) takes the edge off the rest.

A colour grade helps too: generated food comes out oversaturated and
plastic-smooth. The encode pulls saturation to 0.85, softens the micro-detail
slightly, and the page lays a fixed film-grain field over the footage in CSS.
Grain is what makes it read as photographed rather than rendered — and doing
it in CSS rather than baking it into the video matters, because baked-in grain
pushed the desktop file from 2.3 MB to 4.1 MB. The grain is static, never
animated: nothing in this hero moves unless the visitor scrolls.

Stronger denoising was tried and rejected: `s=49` plus `vaguedenoiser` ghosted
the moving plates, which is worse than the shimmer. Stabilizing out the camera
push-in was also tried and made churn worse, not better.

### This needs HTTP Range support

Scrubbing means seeking, and seeking needs the host to answer range requests.
GitHub Pages, Netlify, Vercel, S3 and every normal static host do.
`python -m http.server` does **not** — it ignores `Range` and returns the whole
file, so seeking silently fails there.

The page handles that itself: it performs a test seek before committing to the
scrub, and if the seek does not land it drops to a plain one-screen hero
showing the finished table with all the copy already visible. Nothing looks
broken; you just lose the scroll effect. So if the scroll animation is missing
on a given host, that host is not serving ranges.

## How the hero decides what to show

1. Data saver on, or a 2g connection → no video at all, the poster stands in.
2. Screen ≤900px → `hero-mobile.mp4`.
3. Otherwise → `hero.mp4`.

The poster is painted by CSS *underneath* the video, so the frame is never
empty: not while the video downloads, not if autoplay is blocked, not with
JavaScript off. The video also pauses whenever it scrolls out of view or the
tab is hidden, so it isn't burning a phone battery in the background.

`reduce motion` skips the video and shows the poster.

## Re-encoding, if the render is ever replaced

```
ffmpeg -i RAW.mp4 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 \
  -preset slow -movflags +faststart -an hero.mp4
ffmpeg -i RAW.mp4 -vf scale=854:480 -c:v libx264 -profile:v main \
  -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart -an hero-mobile.mp4
ffmpeg -ss 7.7 -i RAW.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 4 hero-poster.jpg
ffmpeg -ss 7.7 -i RAW.mp4 -frames:v 1 -vf scale=900:-2  -q:v 5 hero-poster-mobile.jpg
```

`-movflags +faststart` is the important one: it moves the index to the front of
the file so playback can start before the whole thing has downloaded.

## Original slot notes

**When that file exists it becomes the hero outright** — the rotating plate
stills are removed and the film plays on its own, muted and looping. If the
file isn't there, nothing breaks: the stills carry the hero instead, and with
no stills either the warm plate ground stands in.

No code changes needed either way. Just drop the file in and refresh.

## Getting the render into place

Generated with the Higgsfield MCP from the restaurant's own five food photos as
image references, so the dishes on screen are theirs and not stock food. That
matters here — it's a glatt kosher kitchen, and generic AI food could easily
show something that doesn't belong on their site.

This build environment's egress policy blocks Higgsfield's CDN, so the file
can't be downloaded from inside the session. To install it:

The render is hosted here:

**https://d8j0ntlcm91z4.cloudfront.net/user_3IkRZvhQJHVYjmx5uflJWyvBjWO/hf_20260910_192141_44f6644c-b05a-46eb-9c83-e7f421fe9b06.mp4**

1. Open that link in a browser (or right-click -> Save As) and download the `.mp4`.
2. Rename it `hero.mp4` and drop it in this folder.
3. Refresh. The film takes over the hero automatically.

Job id `44f6644c-b05a-46eb-9c83-e7f421fe9b06`, in case it needs to be found
again in Higgsfield.

## Settings used

| | |
|---|---|
| Model | `seedance_2_0_mini` |
| Resolution | 720p, high bitrate |
| Duration | 8s |
| Aspect | 16:9 |
| Audio | off (silent) |
| References | all five supplied dish photos |

Silent and `autoplay muted loop playsinline` — all four are required for
autoplay to work in every major browser.

## Why 720p and not 1080p

`seedance_2_5` and `seedance_2_0` both refused with **"requires plus plan or
higher"** on this account. `seedance_2_0_mini` is the best reference-driven
video model the starter plan allows, and it caps at 720p.

On a Plus plan the same prompt and the same five references re-run at 1080p
(and up to 4K on `seedance_2_0`). Worth it if the demo gets shown on a large
screen; 720p is fine on a laptop or phone.

## Prompt used

> Cinematic slightly-overhead shot of a warm restaurant table set with soft
> ivory linen in gentle warm daylight. The exact plated dishes from the
> reference images arrive one at a time, gliding smoothly into frame from
> different edges and settling with realistic weight. Each dish keeps its exact
> appearance, plating, garnish and colors from the references. Very slow,
> almost imperceptible camera push-in throughout. Soft warm light, natural soft
> shadows, no harsh flash. Keep the plates within the upper two thirds of the
> frame. Realistic premium restaurant film. No text, no logos, no watermarks,
> no hands, no people.

Two things the prompt is deliberately doing: the warm ivory daylight matches the
site's sand palette rather than fighting it, and the plates are kept in the
upper two thirds because the media panel's bottom edge dissolves into the page
ground — anything down there gets faded out.
