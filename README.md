# Website Skills

The codebase for a website, built with Claude Code. Three design skills are wired up
as **always-on plugins** for this project (see [Auto-activation](#auto-activation)
below), plus two MCP servers for pulling in ready-made UI components — so every
Claude Code session opened in this repo automatically has UI/UX pattern databases,
design-critique commands, and component registries available while coding.

## The site

A static, cinematic, image-forward landing page for **[The Caffeine Haven](https://www.instagram.com/thecaffeinehaven/)**,
a real coffee shop at 216 Main St in downtown Toms River, NJ — built as the first real
page in this repo, using the skills and MCP tooling above.

- `index.html` / `css/style.css` / `js/main.js` — no framework, no build step; open
  `index.html` directly or serve the repo root.
- **Design**: a full dark theme (warm near-black throughout, not just the hero) with
  one restrained copper/amber accent and gold used only as a rare glint — Fraunces
  for display type, Manrope for everything else. A small sunburst mark (drawn as an
  inline SVG symbol) mirrors the logo on the shop's own cups, used in the header,
  footer, and worked into each cup illustration.
- **Hero**: a built illustration, not a photo or video — cups and pastries (all
  inline SVG, defined at the top of `index.html`) drop in from above and settle onto
  a lit counter (`js/main.js` → `heroSpread()`), staged after a reference photo of the
  shop's own drinks and baked goods. No image/video assets required, no network
  dependency beyond the GSAP/Lenis CDNs the rest of the site already uses.
- **Motion**: [Lenis](https://github.com/darkroomengineering/lenis) momentum scroll +
  GSAP `ScrollTrigger` for reveals, parallax, the hero drop-in, and a scroll-scrubbed
  hero exit; Three.js for a hover-ripple distortion on the atmosphere gallery only.
  Every WebGL/GSAP feature is loaded via a resilient bootstrap — if a CDN is ever
  unreachable for a visitor, the page falls back to fully static (all content
  visible, no animation) instead of breaking.
- **Content is real**, pulled from the shop's own public listings (Google Business,
  Yelp, delivery-app menus) and press coverage: address, phone, hours, opening story
  (August 2024, in a storefront that used to be a different local coffee spot),
  real menu items/prices, and review themes (quiet mornings, a kids' play corner,
  board games at the tables). A few details are still marked `TODO` in `index.html`
  where public sources disagreed slightly (exact hours) — confirm against the
  in-store menu/hours before launch. Testimonials are placeholder copy written in the
  brand voice around those real review themes, not verbatim reviews — swap in actual
  customer quotes (with permission) before launch.
- **Photography is placeholder** outside the hero — every other image slot has a soft
  procedural gradient placeholder tuned to the brand's dark palette, and upgrades
  automatically the moment a real photo is dropped in — see
  [`images/README.md`](images/README.md) for the exact filenames expected. A real
  hero video is an optional future upgrade — see [`videos/README.md`](videos/README.md).

## Skills

### [`skills/ui-ux-pro-max-skill/`](skills/ui-ux-pro-max-skill)
**UI/UX Pro Max** — by [nextlevelbuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

AI-powered design intelligence with 84 UI styles, 192 color palettes, 74 font pairings,
98 UX guidelines, and 25 chart types across 22 tech stacks. Includes Claude skills for
UI styling, design systems, branding, banner design, and slides.

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- License: MIT

### [`skills/impeccable/`](skills/impeccable)
**Impeccable** — by [Paul Bakaus](https://github.com/pbakaus/impeccable)

Design fluency for frontend development: 1 skill with 23 commands
(`/impeccable polish`, `/impeccable audit`, `/impeccable critique`, etc.) plus
curated anti-pattern detection for impeccable frontend design.

- Source: https://github.com/pbakaus/impeccable
- Homepage: https://impeccable.style

### [`skills/frontend-design/`](skills/frontend-design)
**Frontend Design** — by Anthropic

Official Claude Code plugin for creating distinctive, production-grade frontend
interfaces that avoid generic AI aesthetics, with guidance on bold design choices,
typography, animation, and visual detail. Auto-invoked for frontend work.

- Source: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design
- Also listed at: https://claude.com/plugins/frontend-design

## Resources

### [`resources/magic-ui-mcp.md`](resources/magic-ui-mcp.md)
**Magic UI MCP Server** — setup notes for Magic UI's [Model Context Protocol](https://modelcontextprotocol.com/)
server, which gives an AI-assisted IDE (or Claude) direct access to all Magic UI
components for accurate, low-error code generation.

- Source: https://magicui.design/docs/mcp

### [`resources/react-bits-mcp.md`](resources/react-bits-mcp.md)
**React Bits MCP (via shadcn)** — setup notes for pulling [React Bits](https://reactbits.dev/)
components directly into a project through shadcn's registry/MCP tooling.

- Source: https://reactbits.dev/

## Auto-activation

The three skills above are registered as real Claude Code **plugins** (not just files
sitting in a folder) via a local marketplace, so they load automatically in every
Claude Code session opened in this repo — no manual install step:

- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — declares the
  local marketplace `website-skills`, pointing at the three vendored plugin sources.
- [`.claude/settings.json`](.claude/settings.json) — registers that marketplace
  (`extraKnownMarketplaces`) and enables all three plugins by default
  (`enabledPlugins`), checked into git so it applies for every contributor. This also
  makes `impeccable`'s agents and hooks work correctly (its hooks reference
  `${CLAUDE_PLUGIN_ROOT}`, which only resolves for a properly installed plugin, not a
  bare copied file).

Verify anytime with `claude plugin list` (should show all three as `enabled`,
`Scope: project`) or `claude plugin details <name>@website-skills` for a full
component breakdown (skills/agents/hooks).

### MCP servers

[`.mcp.json`](.mcp.json) registers two MCP servers, auto-approved for this project via
`enableAllProjectMcpServers` in `.claude/settings.json`:

- **`shadcn`** — `npx shadcn@latest mcp`, used together with
  [`components.json`](components.json)'s `@react-bits` registry entry to pull
  [React Bits](https://reactbits.dev/) components on request.
- **`magicuidesign-mcp`** — `npx @magicuidesign/mcp@latest`, for pulling
  [Magic UI](https://magicui.design/) components on request.

`package.json` here just pins the `shadcn` CLI as a dev dependency so the `shadcn` MCP
server starts quickly; it isn't the site's own framework/dependency list.
