# Hero video — Grand NJ Construction

The hero sequence is three beats:

1. **Van pulls up** — generated (Higgsfield), anchored to the client's own van photo
2. **Camera rises up a ladder to the roof edge** — generated, no text and no people in
   frame, so nothing for the model to get wrong. NOT YET GENERATED (out of credits).
3. **Roof work** — the client's own footage. BLOCKED: ownership unconfirmed, and there
   is an identifiable worker in frame. Do not ship until that's cleared.

Expected local filenames (the page falls back cleanly to a static hero if absent):

```
videos/van-arrival.mp4
videos/ladder-rise.mp4
videos/roof-work.mp4
```

## Why the van is generated from a photo rather than described

AI video models redraw every frame from scratch and cannot hold legible text. The van
carries the company name, the phone number (551-222-5512) and the NJ HIC license
(13VH12012200) — a render that garbles any of those is worse than no video at all.
So the real photograph is fed in as an anchor frame rather than describing the van in
words. Take 1 used it as the END frame, take 2 as the START frame.

If both takes still mangle the lettering, the fix is NOT another generation — it's
compositing: the real photo, cut out and animated over a plate, which keeps the
lettering pixel-exact because it *is* the photograph. Zero credits, and it scroll-links
more precisely than video can.

## Renders

This environment's egress policy blocks the Higgsfield CDN, so these were generated
but never viewed here — they need downloading and reviewing by hand.

**Take 1** — `veo3_1_lite`, 6s, 16:9, 720p, silent, seed 110777, photo as END frame.
Prompt: slow tracking shot, van rolls down a residential street and settles at the
curb, resolving onto the real photograph.
https://d8j0ntlcm91z4.cloudfront.net/user_3IkRZvhQJHVYjmx5uflJWyvBjWO/hf_20260915_162152_b201f2b6-6207-413d-b016-978aaaa2c6fd.mp4

**Take 2** — `veo3_1_lite`, 6s, 16:9, 720p, silent, seed 543015, photo as START frame.
Prompt: van rolls forward along a North Jersey street, turns left into a private
driveway beside a two-family house, stops. Livery strings written into the prompt.
Job `f7d71348-a1b8-4661-8200-af10c986dbe3`.

## Credits

Starter plan, 15.06 at the start of this work. Take 1 and take 2 cost 6 each,
leaving ~3.06 — not enough for another 6s render. Pricing checked at the time:
veo3_1_lite 6s = 6, kling3_0_turbo 5s/1080p = 10, minimax_h3_max 5s = 12.5,
happy_horse 5s/1080p = 22.5, seedance_2_5 5s/720p = 32.5.

## Mobile

Video is desktop-only. Phones get a still frame — the locked design budgets motion at
near-zero on mobile and the page must stay fast on mobile data.
