# Grand NJ Construction — Design System (LOCKED)

Direction: **Weatherline.** A roof is the line between your house and the weather.
The page is held together by one drawn line that changes profile at every section —
gable, chimney, gutter edge, step flashing. That line is the signature; everything
else stays quiet.

Thesis (from their own reviews, not invented): customers praise *communication* —
"took pictures and kept us up to date." Every contractor claims craftsmanship.
Almost none promise you'll know what's happening on your roof. That's the page's
one argument.

Source: `skills/ui-ux-pro-max` palette #51 (Construction/Architecture) and #84
(Architecture/Interior), retuned to real trade materials; font pairing derived from
#44 / #49 in `typography.csv`. Both families verified absent from impeccable's
`OVERUSED_FONTS` set.

---

## 1. Color roles — SUPERSEDED 16 Sep 2026

The original palette was a materials one: fired clay, wet slate, mortar, zinc,
aged copper. The client asked for a three-colour scheme instead, taken from a
reference site he supplied — **white, a dark blue, and a construction orange**
— with every page background white.

That is now the system. The old token names still exist in `style.css` as
aliases onto the new values, so nothing downstream had to be rewritten.

| Token | Hex | Role |
|---|---|---|
| `--white` | `#FFFFFF` | Every page and section background. No greys. |
| `--navy` | `#14213D` | Body ink on white, and every dark surface |
| `--navy-700` | `#1D2E52` | A panel raised off the navy |
| `--navy-line` | `#2C3E63` | Borders and rules on navy |
| `--orange` | `#F4701E` | The accent — on navy, and as a fill |
| `--orange-mid` | `#D95F12` | Hover on a fill |
| `--orange-ink` | `#B44A06` | The same orange as TYPE on white |
| `--orange-deep` | `#A84405` | Orange over photography, and on the tint |
| `--orange-tint` | `#FDEDE2` | Pill and notice grounds |
| `--ink-mute` | `#54637A` | Secondary text on white |
| `--line` | `#D7DDE6` | Decorative hairline |
| `--line-strong` | `#8A96A8` | Form control borders |
| `--on-navy` | `#C9D4E4` | Body copy on navy |
| `--on-navy-mute` | `#8FA0BA` | Captions on navy |

### The two traps in this palette

**White on orange fails.** `#F4701E` under white text is 2.92:1 — below the
floor at every size. Every orange fill on this site carries NAVY text instead,
at 5.46:1: the primary button, the mobile call dock, the newsletter send disc.
A bright construction orange looks like it wants white type and cannot have it.

**Orange as type on white fails too.** `#F4701E` on white is 2.92:1. Orange
text on a white ground always uses `--orange-ink` (5.35:1), or `--orange-deep`
(6.01:1) where it sits over photography.

### Measured pairs

| Pair | Ratio |
|---|---|
| navy on white | 15.97 |
| ink-mute on white | 6.10 |
| orange-ink on white | 5.35 |
| orange-deep on white | 6.01 |
| orange on navy | 5.46 |
| navy on orange | 5.46 |
| white on navy | 15.97 |
| on-navy on navy | 10.67 |
| line-strong on white | 3.00 (the UI-control floor) |

### The hero

The client's supplied artwork — a house at dusk. Two things were taken out of
the FILE rather than hidden with CSS: the service-tile band across the bottom
and every pixel of baked-in type. The dark panel that carries the copy is
rebuilt in CSS, because a panel baked into the image gets cropped away at some
viewport widths and survives at others.

**Ink brightness is what buys picture.** Every point of contrast the type
gains is a point of scrim the photograph does not have to pay for. Over the
artwork the hero uses `--orange-lift`, `--on-photo` and `--on-photo-mute`
rather than the flat accent and the on-navy greys; that alone let the vertical
wash drop from .34/.22/.58 to .22/.12/.46 and the horizontal midpoint from
.72 to .60. At the old ink those numbers put four elements under the floor.

Worst case, measured by compositing the plate through the exact scrim
gradients and taking the BRIGHTEST pixel under each run of glyphs — light ink,
so bright is the worst case:

| Element | Ink | 1920 | 1440 | 414 | 390 | 375 | 360 | Floor |
|---|---|---|---|---|---|---|---|---|
| h1 | white | 7.17 | 7.50 | 8.28 | 8.14 | 7.74 | 8.08 | 3 |
| "outside" | orange-lift | 3.51 | 4.31 | 3.92 | 3.91 | 3.71 | 3.67 | 3 |
| sub | on-photo | 6.37 | 6.86 | 7.72 | 7.82 | 8.34 | 8.85 | 4.5 |
| eyebrow | see below | 5.69 | 5.78 | 8.74 | 8.75 | 9.04 | 8.45 | 4.5 |
| "see our work" | white | 12.43 | 14.16 | 10.91 | 11.15 | 12.11 | 10.54 | 4.5 |
| note | on-photo-mute | 9.18 | 9.09 | 8.16 | 8.21 | 7.18 | 7.22 | 4.5 |

The eyebrow is the one element that changes colour by breakpoint: orange-lift
on desktop, white on mobile. Over the mobile crop NO orange clears 4.5:1 at
any scrim worth having, and at 12px there is no large-text exemption.

"outside" is the binding constraint everywhere. It is large text, so its floor
is 3 — if it ever needs to be smaller than 24px, the scrim has to come back up.

**The mobile plate is a separate portrait photograph**, 720x1280, not a crop
of the desktop artwork. At 0.562 against a phone's ~0.46 it covers with about
18% trimmed off the sides and the full height kept.

Its scrim is SHAPED, not a flat ramp: the plate is dark at the top (deep sky)
and dark at the bottom (lawn in shadow), with a bright band of lit cloud and
lit windows through the middle — exactly where the copy sits. So the scrim is
light at both ends and heavy only across that band. A flat ramp strong enough
for the middle would have buried the sky and the lawn for nothing.

The orange eyebrow was tried again on this plate and still fails (3.6–3.9:1
against a 4.5 floor). Twelve-pixel orange over sky does not work at any scrim
worth having; white stays on mobile.

**The track is 180vh on desktop**, down from 280. It was that long when
scroll was scrubbing video frames and the length WAS the effect.

**On phones the hero is not pinned at all and is only as tall as its
content** — about 0.77 of a screen, down from 1.7. A 100vh panel holding
590px of copy left 250px of lawn under the stat tiles that no amount of
moving the copy around could fix. The picture is absolutely positioned to
the panel, so shrinking the panel crops the plate rather than leaving a gap.
Because the panel is now shorter than the viewport, the ScrollTrigger end
is `bottom top` on phones rather than `bottom bottom`, which would finish
before it started.

Two consequences worth remembering:

- The scrim stops are fractions of the PANEL, not the viewport. Changing the
  panel height moves every stop against a different part of the picture, so
  it is a contrast change.
- Anything staged is now a visible hole at first paint rather than space
  inside a roomy panel. The offer and the call button are therefore never
  staged on phones; only the licence line and the tiles animate in.

Re-measure with `scratchpad/plate.py` if the artwork, the type sizes or the
scrim change. Moving the copy moves which pixels sit under it, so a layout
change is a contrast change.

### The logo

The mark is lifted from the supplied artwork and keyed to transparency. The
WORDMARK in that artwork is not used: it reads **"GRANT NEW JERSEY
CONSTRUCTION"** and the business is **Grand NJ Construction LLC**, per the
licence and the van. The name is set as live text instead — correct,
crisp at any size, and readable to search engines.

### Contrast rules (measured, not assumed)

- ink on mortar **12.37:1** · ink on limewash **14.18:1** · mortar on slate-900 **13.77:1**
- zinc-600 on mortar **5.38:1** · zinc-400 on slate-900 **6.05:1** · clay-300 on slate-900 **6.77:1**
- **white** on clay-600 **6.05:1** — buttons use `#FFFFFF`, never mortar (mortar on clay is only 4.67:1)
- clay text on light uses **clay-700** (6.17:1), never clay-600 (4.67:1, too tight)
- **patina never carries text on light** (2.74:1). Decorative marks and dark grounds only.

## 2. Type

**Display — Archivo** (variable, `wdth 62..125` / `wght 100..900`). Run it *expanded*
at heavy weight: reads like lettering stamped into equipment, not a poster font.
**Body — Barlow.** Drawn out of California DOT signage — an infrastructure face doing
infrastructure work. **Labels — Barlow Condensed**, uppercase, wide tracked.

One variable file + two statics. No Inter, no Space Grotesk, no Plus Jakarta.

| Role | Font | Size | Detail |
|---|---|---|---|
| `--t-display` | Archivo `wdth 118` `wght 800` | `clamp(2.75rem, 11vw, 7.5rem)` | lh 0.92, tracking -0.03em, sentence case |
| `--t-h2` | Archivo `wdth 112` `wght 700` | `clamp(2rem, 6vw, 3.5rem)` | lh 1.0, tracking -0.02em |
| `--t-h3` | Archivo `wdth 100` `wght 600` | `clamp(1.375rem, 3vw, 1.75rem)` | lh 1.15 |
| `--t-lede` | Barlow 400 | `clamp(1.125rem, 2.4vw, 1.5rem)` | lh 1.45 |
| `--t-body` | Barlow 400 | `1.0625rem` (17px) | lh 1.6, max 68ch |
| `--t-label` | Barlow Condensed 600 | `0.8125rem` | uppercase, tracking 0.14em |
| `--t-data` | Barlow Condensed 700 | `clamp(2.5rem, 7vw, 4rem)` | tabular-nums, for the rating figure |

17px body on mobile, not 16 — these are homeowners reading on a phone, often not 25.

## 3. Space

4px base. `4 8 12 16 24 32 48 64 96 128 160`.
Section rhythm: **64px** mobile → **128px** at ≥1024. Gutters 20px mobile / 24px up.

## 4. Grid

Mobile one column. ≥768px a 12-col grid, 24px gutter, `max-width: 1280px`.
Content blocks span **asymmetrically** — 7/5 and 5/7, never dead center.
Section list rows step by one column in a **running-bond offset**, the way brick is
actually laid. The offset is the layout system, not decoration.

## 5. Surface

Radius **0** on structural blocks — they're sheets and courses. Radius **4px** on
interactive controls so they read as pressable. No soft blurred drop shadows
anywhere; depth comes from a hairline plus a 1px darker bottom edge, the way a course
sits on mortar. Exactly one shadow token, reserved for the sticky mobile call bar.

## 6. Motion

`--d-fast 160ms` · `--d-base 260ms` · `--d-slow 420ms`
`--e-out cubic-bezier(.16, 1, .3, 1)`

Scroll-**linked**, not entrance-triggered. GSAP ScrollTrigger with `scrub: true`
throughout, so scroll position drives it and it rewinds on the way back up.

- **Hero (signature):** sky gradient drains storm → clear as you scroll; the roofline
  SVG parallaxes against the headline at a different rate. Scrubbed.
- **Weatherline dividers:** `stroke-dashoffset` draws with scrub as each section passes.
- **Coursing list:** staggered reveal, `each: 0.06`.
- **Photo slots:** parallax at differing rates.
- **Primary button:** magnetic, `pointer: fine` only.
- **Momentum scroll:** Lenis, desktop only.

**Mobile motion budget ≈ 0.** No Lenis, no magnetic, static hero frame, reveals resolve
instantly. `prefers-reduced-motion` kills every transform and renders final state.
No JS at all → fully readable static page. Non-negotiable.

## 7. Imagery

The hero sky is a **CSS gradient**, not a photo — zero bytes, instant on mobile data,
and it means the page doesn't need photography to ship. Every photo slot is a real
`<picture>` with a procedural placeholder that upgrades the moment a file drops in.
No stock. No competitor's photography. No AI-generated "completed jobs" — fake proof
is the one mistake that costs a real sale.

## 8. Primary action

**One:** call. Tap-to-call, reachable without scrolling on mobile, sticky thereafter.
Secondary: text a photo of the problem. Everything else is tertiary.
