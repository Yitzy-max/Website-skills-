---
description: Build or redesign any website end to end - gap-fills the brief, then runs the full design/motion/review pipeline.
argument-hint: [anything from one line to a full filled-in brief]
---

Build a website. Here's what the user gave you:

**$ARGUMENTS**

## Step 0 — Gap check (do this first, always)

Read `prompts/website-brief.md`. That's the canonical brief. Map whatever the user wrote above
onto its blocks 1-7.

The user may have pasted the whole filled-in template, or they may have typed one line like
`nail salon in Lakewood, tier 2, booking link`. Both are fine. Your job is to figure out what's
missing and get it — in **one batch of questions, not a drip**.

Ask only for what you genuinely can't proceed without:

- **Always required:** business name, trade, location, the ONE primary action + its real
  destination (phone number / booking URL / form target), and the site type.
- **Required unless DEMO MODE:** real hours, real services, real prices if prices are shown,
  and any proof claims (rating, review count, years, licenses). Never invent these.
- **Ask if unclear, but offer a default:** direction/feeling (propose one from the trade and
  say why), motion tier (propose one — Tier 1 for most client work, Tier 2 for demos and
  portfolio-led sites), palette and type (offer to pick from `ui-ux-pro-max`).

Make the questions easy to answer — numbered, with your recommended default already filled in,
so they can reply "yeah, 3 change to X" instead of writing an essay.

If the user wrote `DEMO MODE` anywhere, skip asking for real business facts. Invent a plausible
business for the trade and area, and record every invented fact in `DEMO-CONTENT.md`.

## Step 1-7 — Run the pipeline

Once the gaps are filled, follow `prompts/website-brief.md` section 10 (PROCESS) exactly, under
the constraints in sections 8 (CONSTRAINTS) and 9 (BANNED), and the pipeline in `CLAUDE.md`.

Two things that are not optional:

- **Stop after the direction.** Show the design direction and the locked tokens — palette, type
  pairing, scale, spacing — as a short written brief. Wait for a yes before building the page.
  Do not write a full page on an unconfirmed direction.
- **Motion is scroll-linked, not entrance-triggered.** At Tier 1 and above, use
  `gsap-scrolltrigger` with `scrub: true` so scroll position drives the animation directly.
  Entrance fade-ins are not the deliverable.

Announce which skill you're using at each step so the work is auditable.

Deliver something ready to put in front of a paying client — not a draft.
