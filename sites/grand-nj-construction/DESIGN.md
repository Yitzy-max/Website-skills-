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

## 1. Color roles

Materials, not "construction orange." Fired clay, wet slate, mortar, zinc flashing,
aged copper.

| Token | Hex | Role |
|---|---|---|
| `--c-slate-900` | `#14181C` | Deepest ground: hero base, footer |
| `--c-slate-800` | `#1C2229` | Ink — all primary text on light |
| `--c-zinc-600`  | `#4E5B66` | Secondary text, meta, hairline on light |
| `--c-zinc-400`  | `#8B98A3` | Captions and secondary text on dark only |
| `--c-mortar`    | `#E4E2DC` | Page ground |
| `--c-limewash`  | `#F2F1ED` | Raised surfaces, cards, form fields |
| `--c-rule`      | `#C2BEB4` | Hairlines and borders on light |
| `--c-rule-dark` | `#2E363E` | Hairlines and borders on dark |
| `--c-clay-600`  | `#9E4A2C` | Primary action / signal |
| `--c-clay-700`  | `#843B21` | Action hover + pressed; clay-colored TEXT on light |
| `--c-clay-300`  | `#E08A5F` | Clay on dark grounds only |
| `--c-patina`    | `#6E8F82` | Aged-copper mark: "done" states, structural marks |

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
