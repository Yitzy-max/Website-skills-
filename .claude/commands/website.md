---
description: Build or redesign a client website end to end, running the full design/motion/review skill pipeline.
argument-hint: [client name or brief, e.g. "Bella Nails, nail salon in Toms River"]
---

Build a client website for: **$ARGUMENTS**

Follow the pipeline in `CLAUDE.md` in full. Do not skip steps and do not substitute your own
judgment for the skills — they are installed for exactly this.

Work in this order, and say which skill you're using at each step so the work is auditable:

1. **Gather.** What do you actually know about this business, and what's missing? List the unknowns
   (address, hours, phone, services, prices, existing branding, photos) and ask for them in one
   batch before building. Don't invent business facts.

2. **Direction.** Use `design-taste-frontend` to commit to a design direction from the brief.
   Pull the palette, font pairing, and UI style from `ui-ux-pro-max`. Show the direction — a short
   written brief plus the concrete tokens — and confirm before writing a full page.

3. **System.** Lock tokens with `design-system` / `theme-factory`.

4. **Build.** `ui-styling` for styling, `21st-ui` plus the shadcn and Magic UI MCP servers for real
   components, `writing-guidelines` for every line of visitor-facing copy.

5. **Motion.** `web3d-integration-patterns` to decide how far to go, then the GSAP / Motion /
   scroll skills. Everything degrades to a fully readable static page if it fails to load.

6. **Critique.** Run `/impeccable critique` and `/impeccable audit` on the result and fix what they
   find. If this is a redesign, run `redesign-existing-projects` first.

7. **Verify.** `webapp-testing` in a real browser. Phone width. Form submits. Phone number and
   address correct and tappable. `vercel-optimize` for load speed.

Deliver a page that is ready to show a client as a paid demo — not a draft.
