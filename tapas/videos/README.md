# Hero video

**Installed.** The files in this folder are live on the page.

| File | Size | Used for |
|---|---|---|
| `hero.mp4` | 1.6 MB | Screens wider than 900px |
| `hero-mobile.mp4` | 536 KB | Phones and small tablets |
| `hero-poster.jpg` | 127 KB | First paint / autoplay blocked / data saver |
| `hero-poster-mobile.jpg` | 68 KB | Same, on small screens |

The raw Higgsfield render was **18.9 MB at 18.8 Mbps** — an absurd bitrate for
720p and completely unusable on cell data. It is re-encoded above at a sane
bitrate with no visible quality loss, and dropped from the working tree (git
history still has it; so does Higgsfield).

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
