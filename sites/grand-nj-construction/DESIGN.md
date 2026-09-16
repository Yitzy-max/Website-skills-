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

The footage is a white van on a bright street, so the old treatment — darken
the frame, set white type on it — had nothing to grip. It is inverted: a white
scrim LIGHTENS the shot and the type is navy, with one word in orange.

Those scrim values are not eyeballed. Every frame of `hero-desk.mp4` was
composited through the exact gradient pair in software and the darkest pixel
under each run of glyphs was measured. Worst case across all frames:

| Element | Ink | Ratio | Floor |
|---|---|---|---|
| h1 | navy | 10.55 | 3 |
| "outside" | orange-deep | 4.76 | 3 |
| sub | navy | 12.69 | 4.5 |
| eyebrow | orange-deep | 5.61 | 4.5 |
| note | ink-mute | 5.67 | 4.5 |

Re-measure with `scratchpad/herocheck.py` if the footage or the gradient changes.

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
