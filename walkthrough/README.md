# The Gym Lakewood — 3D Walkthrough

A cinematic interior walkthrough built from the architect's **Proposed Floor Plan,
Option 2 (2024.04.28)** for The Gym Lakewood, Lakewood NJ. Every room on the plan is
modelled to its drawn position and dressed with the equipment the plan calls for.

Two things live here:

| What | Where |
|---|---|
| Interactive walkthrough (runs in any browser, WebGL) | `walkthrough/index.html` |
| Rendered video, 1280×720 / 24fps / ~76s | `videos/gym-lakewood-walkthrough.mp4` |
| Poster frame for the video | `videos/gym-lakewood-walkthrough-poster.jpg` |

## Viewing it

It's ES modules, so it needs to be served over HTTP — opening the file directly
with `file://` will not work.

```bash
python3 -m http.server 8080
# then open http://localhost:8080/walkthrough/
```

Controls: **space** play/pause, **←/→** skip 2s, the chapter list on the left jumps to
any room, and the buttons bottom-right restart or pause. All of it hides itself when
you're not moving the mouse, so it screen-records clean.

## Re-rendering the video

```bash
npm install
npm run render:walkthrough                      # 1920×1080 @ 30fps, the default
node tools/render-walkthrough.js --w 1280 --h 720 --fps 24
node tools/render-walkthrough.js --start 37 --end 46   # just the pool shot
```

The renderer serves the repo, drives the tour one frame at a time in headless
Chromium (`window.__walkthrough.frame(t)` — no wall-clock timing, so frames are
identical run to run), and pipes JPEGs straight into ffmpeg. On the software
rasteriser it runs around 0.9 frames/sec at 720p, so a full pass is roughly half an
hour; on a machine with a real GPU it's minutes.

`--out` sets the destination. A poster frame is written alongside it automatically.

## The route

Fourteen shots, cut rather than blended between rooms:

1. Arrival — exterior, through the storefront
2. Reception (87 SF) + towel pickup
3. Juice Bar (137 SF) — prep with sink, vending
4. Seating Area (125 SF)
5. Spin Studio (250 SF) — 20 bikes
6. Locker Room (506 SF) — 100 lockers
7. Showers (190 SF) / Restrooms (177 SF)
8. Sauna
9. Pool (1,886 SF) — the long hero dolly down the lanes
10. Pool deck — loungers, rinse shower
11. Workout Area (1,458 SF) — cardio + selectorized
12. Free Weights (865 SF) — racks, benches, dumbbells
13. Group Exercise (2,040 SF)
14. Pull back to an overhead cutaway with every room tagged by name and SF

To change the route, edit `SHOTS` in `walkthrough/js/scene/tour.js` — each entry is
just a start/end camera position, a start/end look-at target, a focal length ramp and
a caption. Durations add up to whatever the total runtime is; nothing else needs
touching.

## How it's put together

```
walkthrough/
  index.html            overlay chrome — captions, chapter list, progress bar
  js/app.js             renderer, IBL, water ripple, playback + capture hook
  js/scene/gym.js       the building: rooms, walls, floors, fixtures, lighting
  js/scene/props.js     equipment library (treadmill, squat rack, sauna, …)
  js/scene/tour.js      camera choreography
  js/scene/textures.js  procedural wood / rubber / tile / concrete, signage text
  js/lib/               vendored three.js r186 + RoomEnvironment
tools/render-walkthrough.js
```

No external assets — every texture is drawn to a canvas at load time and three.js is
vendored, so the page works offline and there is nothing to 404.

Units are **feet**, origin at the north-west corner, +X east, +Z south. `ROOMS` in
`gym.js` holds each room's rectangle and the square footage printed on the plan; move a
wall by editing that table and the floor plates, labels and partitions follow.

### Things worth knowing if you change it

- **The pool is a hole in the floor.** Floor plates are cut around `POOL` rather than
  drawn as one sheet — draw a plate across it and the water disappears underneath.
- **Zone finishes sit at y=0.06, the base slab at y=0.02.** Same height in both places
  means z-fighting and the wrong floor wins.
- **Punctual lights are expensive** on the software rasteriser used for offline
  rendering. There are seven, all doing real work (spin studio gels, sauna, pool,
  lobby). Everything else is emissive LED coves + hemisphere + image-based lighting.
  Adding a handful of point lights roughly halves render speed.
- **Shadows are baked once** (`renderer.shadowMap.autoUpdate = false`). Nothing in the
  scene moves but the water and the camera. If you animate geometry, that has to change.
