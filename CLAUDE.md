# How to build a website in this repo

This repo is a website shop. The work is small-business sites — barbers, salons, med spas,
electricians, solar, dentists. Mostly informational: who they are, what they do, proof they're
good, and one clear way to get in touch or book. No dashboards, no e-commerce, no CMS unless
someone asks.

Every site gets built at a level the client would not get anywhere else for the price.
Generic template output is a failure, even if it "works".

## Always-on rule

Any time the task is building, redesigning, or polishing a website — a new client site, a demo,
a landing page, a section, even a single hero — run the pipeline below. Do not freelance it.
The skills are installed for this; use them.

**The brief comes first.** [`prompts/website-brief.md`](prompts/website-brief.md) is the
universal intake template — business, site type, the one action, proof, content status,
direction, motion tier, then fixed constraint/process blocks. Run `/website` with whatever the
user has (a full filled-in brief or a single line) and gap-fill the rest in one batch of
questions before building. `/brief` prints the blank template.

## The pipeline

**1. Direction, before any code.**
Read the brief and pick a real design direction. `design-taste-frontend` is the default for this
step — it reads the brief and commits to a direction instead of defaulting to centered-hero-plus-
three-cards. `frontend-design` and `modern-web-design` back it up. If the client is a specific
aesthetic — raw and industrial, clean editorial, soft and premium — pull `industrial-brutalist-ui`,
`minimalist-ui`, or `high-end-visual-design` instead.

Pull the concrete choices from `ui-ux-pro-max`: palette, font pairing, UI style. Don't invent a
palette from scratch when there are 192 sitting there.

**2. Lock the system.** `design-system` and `theme-factory` for tokens — type scale, spacing,
color roles. `brand` / `brand-guidelines` if the client has existing branding to respect. Write
the tokens down before building components, or the page drifts.

**3. Build.** `ui-styling` for the actual styling work. For components, don't hand-roll what
already exists — `21st-ui` searches real components and logos, and the shadcn and Magic UI MCP
servers pull registry components straight in. `animated-component-libraries` covers Magic UI and
React Bits when a section needs motion built in.

Copy matters as much as layout on these sites. `writing-guidelines` for anything the visitor
reads. Keep it plain and human — the way the owner would actually describe their business.

**4. Motion.** Only where it earns its place. `web3d-integration-patterns` decides how far to go
before you commit. Then `gsap-scrolltrigger` for scroll choreography, `motion-framer` for
component transitions, `locomotive-scroll` or `scroll-reveal-libraries` for reveals, `threejs-webgl`
or `lightweight-3d-effects` when a hero genuinely needs it. `barba-js` for page transitions on
multi-page sites.

Rule for every motion feature: the page must still be fully readable with all content visible if
the animation never loads. Progressive enhancement, always.

**5. Critique before delivery.** This is the step that gets skipped and shouldn't be.
`/impeccable critique` and `/impeccable audit` on the finished page. `redesign-existing-projects`
when the job is upgrading something that already exists — it's built to find the generic AI
patterns and kill them. `web-design-guidelines` and `react-best-practices` for craft-level review.

**6. Verify it actually works.** `webapp-testing` to drive the real page in a browser. Check it at
phone width. Check the contact form submits. Check every phone number and address is correct and
tappable. `vercel-optimize` for load performance — these clients' customers are on phones on
mobile data.

## Non-negotiables on client work

- Real content only. Real address, real hours, real phone, real services and prices. Placeholder
  lorem never ships. If a detail is unknown, ask — don't invent business facts.
- Never use a client's competitor's photography, or any image without rights. Placeholder image
  slots that upgrade when a real photo drops in, like `images/README.md` describes.
- Mobile first. Most of these visitors are on a phone looking for a phone number.
- One obvious action per page: call, book, or fill the form.
- Fast. No 4MB hero images, no framework for a five-section site.

## Skills that are installed but off

`convex-backend` (33 Convex skills), `vercel-react-native`, `web-motion-authoring`
(Blender/Rive/Spline/Substance), and `anthropic-extras` are vendored and ready but disabled, so
they don't crowd out the website skills. Flip any of them to `true` in `.claude/settings.json`
when a job actually needs them.

## Other work in this repo

`anthropic-documents` (docx/pptx/xlsx/pdf) is on for client-facing paperwork — proposals,
invoices, one-pagers. `anthropic-builder` (skill-creator, mcp-builder, claude-api) is on for
building internal automation.
