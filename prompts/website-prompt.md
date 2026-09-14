# The website prompt

Business-agnostic. Paste this, then paste whatever business info you want underneath it.

---

Build a website.

## The bar

This has to look like a studio built it, not a template and not an AI. If the result could
be mistaken for any other AI-generated site, it failed — even if it works. Ship something
that would be worth several times what it costs.

## Use the skills — don't freelance it

**Direction first, before any code.** `design-taste-frontend` reads the brief and commits to
a real design direction. `frontend-design` and `modern-web-design` back it up. Pull the
concrete palette, font pairing and UI style from `ui-ux-pro-max` — 192 palettes and 74 font
pairings are sitting there, don't invent one from scratch. If a specific aesthetic is called
for, use `high-end-visual-design`, `minimalist-ui`, or `industrial-brutalist-ui` instead.

**Lock the system.** `design-system` and `theme-factory` for tokens — type scale, spacing,
color roles. Write them down before building components or the page drifts.

**Build.** `ui-styling` for the styling work. `21st-ui` plus the shadcn and Magic UI MCP
servers for real components — don't hand-roll what already exists.
`animated-component-libraries` when a section needs motion built in.

**Copy.** `writing-guidelines` for every line a visitor reads. Plain and human, the way the
owner would actually describe it out loud. Nothing salesy, nothing corporate, no AI voice.

**Motion.** `web3d-integration-patterns` decides what earns its place before you commit. Then
`gsap-scrolltrigger` for scroll choreography, `motion-framer` for component transitions,
`locomotive-scroll` for smooth scroll and parallax, `threejs-webgl` or
`lightweight-3d-effects` when a hero genuinely needs it, `barba-js` for page transitions.

**Critique.** `/impeccable critique` and `/impeccable audit` on the finished page, then fix
what they find. `redesign-existing-projects` first if this is an upgrade to something that
already exists. `web-design-guidelines` for craft review.

**Verify.** `webapp-testing` to drive the real page in a browser. `vercel-optimize` for load
speed.

Say which skill you're using at each step.

## Motion

Scroll-**linked**, not entrance-triggered. This is the difference between a site that feels
like a machine you're operating and one that feels like a template playing canned animations
at you. Use `gsap-scrolltrigger` with `scrub: true` so scroll position drives the animation
directly and it rewinds when you scroll back up. Entrance fade-ins are the cheap default —
don't ship them as the main event.

Default level unless I say otherwise: momentum scroll, one scrub-linked hero moment,
staggered reveals, parallax at differing rates, magnetic primary button. Go further —
pinned sections, WebGL hero, page transitions — only if I ask for it.

Every motion feature degrades to a fully readable static page if it fails to load. All
content visible without JS. Respect `prefers-reduced-motion`. No exceptions.

## Constraints

Mobile first — assume most visitors are on a phone, and cut the motion budget to near-zero
there. The primary action is reachable without scrolling on mobile. Fast on mobile data:
no 4MB heroes, no framework for a five-section site. Real contrast, focus states, alt text,
semantic HTML. Placeholder image slots that upgrade the moment a real photo drops in. No
unlicensed images, no competitor's photography, no stock that screams stock.

One obvious primary action per page. Everything else is secondary.

## Never

Invent facts. If you don't have a real hour, price, phone number, review, credential, or
name, ask me — don't fill it in. Fake proof is the one mistake here that costs real money.

## Banned

Centered hero over a purple-blue gradient. Three feature cards in a row. Inter as the display
face. "Elevate your experience." "Your journey starts here." "We're passionate about…"
Glassmorphism by default. Emoji as section icons. A testimonial slider nobody will click.

## Process

1. Tell me what's missing from what I've given you. Ask for all of it in one batch, with your
   recommended default already filled in so I can just confirm.
2. Commit to a direction and lock the tokens. **Show me both, then stop and wait for my yes.**
   Do not write a full page on an unconfirmed direction.
3. Build it.
4. Critique it and fix what you find.
5. Verify it in a browser at phone width and desktop — primary action works, nothing
   overflows, readable with JS off.
6. Tell me what you'd improve with more budget and what you still need from me.

---

**Business details below.**
