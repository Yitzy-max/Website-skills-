# Website Skills

The codebase for a website, built with Claude Code. Three design skills are wired up
as **always-on plugins** for this project (see [Auto-activation](#auto-activation)
below), plus two MCP servers for pulling in ready-made UI components — so every
Claude Code session opened in this repo automatically has UI/UX pattern databases,
design-critique commands, and component registries available while coding.

## The site

A static, cinematic, image-forward landing page for **Caffeine Heaven**, a dim,
unhurried neighborhood coffee shop — built as the first real page in this repo, using
the skills and MCP tooling above.

- `index.html` / `css/style.css` / `js/main.js` — no framework, no build step; open
  `index.html` directly or serve the repo root.
- **Design**: a full dark theme (warm near-black throughout, not just the hero) with
  one restrained copper/amber accent and gold used only as a rare glint — Fraunces
  for display type, Manrope for everything else. The hero plays on the brand's own
  pun: soft CSS "godray" light drifting through the dark, echoing steam catching
  light in a dim room.
- **Motion**: [Lenis](https://github.com/darkroomengineering/lenis) momentum scroll +
  GSAP `ScrollTrigger` for reveals, parallax, and a scroll-scrubbed hero exit; Three.js
  for a custom-shader hero image crossfade and a hover-ripple distortion on the
  atmosphere gallery. Every WebGL/GSAP feature is loaded via a resilient bootstrap —
  if a CDN is ever unreachable for a visitor, the page falls back to fully static (all
  content visible, no animation) instead of breaking.
- **Content** is built from the brand brief: a chill, aesthetic, quiet café that's
  equally good for deep work (wifi, outlets, quiet corners), families (a kids'
  corner), and readers/dates (a patio, a quiet street) — laid out as three alternating
  editorial rows rather than a generic three-card grid. Menu items, hours, and address
  are marked as drafts/placeholders (see the `TODO` comments in `index.html`) —
  confirm the real details before launch. Testimonials are placeholder copy written
  in the brand voice, not real reviews — swap them in before launch.
- **Photography is placeholder** — every image slot has a soft procedural gradient
  placeholder tuned to the brand's dark palette, and upgrades automatically the
  moment a real photo is dropped in — see [`images/README.md`](images/README.md) for
  the exact filenames expected. The hero video slot works the same way — see
  [`videos/README.md`](videos/README.md) for the concept and generation notes.

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
