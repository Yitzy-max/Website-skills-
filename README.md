# Website Skills

The website shop. 105 skills across 18 plugins are wired up as **always-on plugins**
for this project (see [How auto-activation works](#how-auto-activation-works) below),
plus three MCP servers for pulling in real UI components — so every Claude Code session
opened in this repo has design taste, UI/UX pattern databases, motion and 3D libraries,
design-critique commands, and component registries available while building.

## The site

A static, image-forward landing page for **[Il Giardinello Di Bacoli](https://www.ilgiardinello.com/)**,
a family-run Neapolitan ristorante in Toms River, NJ — built as the first real page
in this repo, using the skills and MCP tooling above.

- `index.html` / `css/style.css` / `js/main.js` — no framework, no build step; open
  `index.html` directly or serve the repo root.
- **Motion**: [Lenis](https://github.com/darkroomengineering/lenis) momentum scroll +
  GSAP `ScrollTrigger` for reveals, parallax, and a pinned-feeling hero; Three.js for
  a custom-shader hero image crossfade and a hover-ripple distortion on gallery
  thumbnails. Every WebGL/GSAP feature is loaded via a resilient bootstrap — if a CDN
  is ever unreachable for a visitor, the page falls back to fully static (all content
  visible, no animation) instead of breaking.
- **Content is real**, pulled from the restaurant's own site, Google Business listing,
  and public review platforms: address, phone, hours, owner story (Gennaro & Danielle
  Costigliola), real menu items/prices, and excerpted review quotes. The site's own
  navigation order (Home / Menus / At a Glance / Gallery / Off-Premise Catering /
  Directions / Contact Us) is mirrored in the header dropdown.
- **Photography is placeholder** — direct web access to fetch the restaurant's actual
  photos wasn't available in the build environment, and using someone else's
  copyrighted photography without rights wouldn't be right regardless. Every image
  slot has a soft procedural gradient placeholder and upgrades automatically the
  moment a real photo is dropped in — see [`images/README.md`](images/README.md) for
  the exact filenames expected.

## Building a website here

[`CLAUDE.md`](CLAUDE.md) is the build playbook — the ordered pipeline (direction → design
system → build → motion → critique → verify) and which skill owns each step. It loads
automatically in every Claude Code session in this repo, so the skills below actually get
used instead of sitting on disk.

[`prompts/website-brief.md`](prompts/website-brief.md) is the universal intake template —
works for any industry and any site type. Fill the seven slots (business, site type, the one
action, proof, content status, direction, motion tier); the constraint, anti-slop, and process
blocks below them stay fixed every job.

Three project commands:

- **`/website <anything>`** — takes a full filled-in brief *or* a one-line description, asks for
  whatever's missing in one batch, then runs the whole pipeline.
- **`/brief`** — prints the blank template to fill in.
- **`/skills-check`** — verifies every plugin, skill, and MCP server resolves.

## The skill stack

105 skills across 18 plugins, vendored into [`skills/`](skills) and registered as real
Claude Code plugins through the local `website-skills` marketplace. 63 are enabled by
default; the rest are installed but switched off so they don't crowd out website work.

### Design & taste

| Plugin | Skills | Source |
| --- | --- | --- |
| `ui-ux-pro-max` | 7 — 84 UI styles, 192 palettes, 74 font pairings, 98 UX guidelines | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) |
| `taste-skill` | 13 — anti-slop frontend taste, brutalist / minimalist / high-end directions, redesign audits, image-to-code, brandkit | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) |
| `impeccable` | 1 skill, 23 commands — `polish`, `audit`, `critique`, anti-pattern detection | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `frontend-design` | 1 — distinctive, production-grade interfaces that avoid generic AI aesthetics | [anthropics/skills](https://github.com/anthropics/skills) |
| `anthropic-design` | 6 — canvas design, brand guidelines, theme factory, web artifacts, webapp testing, algorithmic art | [anthropics/skills](https://github.com/anthropics/skills) |
| `21st` | 1 skill + MCP — search and install real components, logos as SVG, AI UI generation | [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) (ISC) |

### Motion & 3D

From [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) (Apache-2.0),
vendored as its five category bundles:

| Plugin | Skills |
| --- | --- |
| `web-motion-core` | Three.js/WebGL, GSAP ScrollTrigger, React Three Fiber, Framer Motion, Babylon.js |
| `web-motion-components` | Magic UI / React Bits libraries, Anime.js, Lottie, React Spring, scroll-reveal |
| `web-motion-scroll` | Locomotive Scroll, Barba.js, PixiJS, PlayCanvas, A-Frame WebXR, lightweight 3D |
| `web-motion-meta` | Modern web design principles, web3D integration patterns |
| `web-motion-authoring` | Blender→web, Rive, Spline, Substance 3D — *off by default* |

### Frontend craft & shipping

From [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills):

| Plugin | Skills |
| --- | --- |
| `vercel-web` | web design guidelines, React best practices, composition patterns, view transitions, writing guidelines |
| `vercel-deploy` | deploy to Vercel, Vercel CLI with tokens, Core Web Vitals / bundle optimization |
| `vercel-react-native` | React Native / Expo — *off by default* |

### Client paperwork & internal tooling

From [anthropics/skills](https://github.com/anthropics/skills):

| Plugin | Skills |
| --- | --- |
| `anthropic-documents` | docx, pptx, xlsx, pdf — proposals, invoices, one-pagers |
| `anthropic-builder` | skill-creator, mcp-builder, claude-api, doc-coauthoring |
| `anthropic-extras` | internal comms, academy guide, discernment nudge, Slack GIFs — *off by default* |

### Backend (off by default)

| Plugin | Skills |
| --- | --- |
| `convex-backend` | 33 — schema design, auth, authz, crons, migrations, deploy guards, cost and monitoring. [get-convex/agent-skills](https://github.com/get-convex/agent-skills) |

Turn any disabled plugin on by flipping it to `true` in
[`.claude/settings.json`](.claude/settings.json).

## How auto-activation works

The skills are registered as real Claude Code **plugins** (not just files in a folder) via a
local marketplace, so they load in every session opened in this repo with no install step:

- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — declares the local
  marketplace `website-skills` and every vendored plugin source.
- [`.claude/settings.json`](.claude/settings.json) — registers that marketplace
  (`extraKnownMarketplaces`) and sets which plugins are on (`enabledPlugins`), checked into
  git so it applies for every contributor. This is also what makes `impeccable`'s agents and
  hooks work — its hooks reference `${CLAUDE_PLUGIN_ROOT}`, which only resolves for a properly
  installed plugin, not a bare copied file.
- [`CLAUDE.md`](CLAUDE.md) — the playbook that names which skill to use at each step, so the
  right ones fire on a real build instead of relying on description matching alone.

Verify with `bash scripts/check-skills.sh` (or `/skills-check`), which walks the marketplace,
resolves every skill path, checks for duplicate skill names across enabled plugins, and lists
the MCP servers. `claude plugin list` shows the same set as `enabled`, `Scope: project`.

## MCP servers

Three, auto-approved for this project via `enableAllProjectMcpServers`:

- **`shadcn`** — `npx shadcn@latest mcp`, used with [`components.json`](components.json)'s
  `@react-bits` registry entry to pull [React Bits](https://reactbits.dev/) components.
- **`magicuidesign-mcp`** — `npx @magicuidesign/mcp@latest`, for [Magic UI](https://magicui.design/)
  components.
- **`21st`** — `https://21st.dev/api/mcp`, registered by the `21st` plugin
  ([`skills/magic-21st/.mcp.json`](skills/magic-21st/.mcp.json)). Component and theme search,
  paid code retrieval, logo search, and AI UI generation.

  **Setup required:** the 21st MCP needs an API key. Get a free one at
  [21st.dev/mcp](https://21st.dev/mcp), then `export API_KEY_21ST=...` in your shell profile.
  Without it the server connects but returns no tools. The old Magic MCP keys were reset
  upstream and no longer work anywhere — generate a fresh one.

`package.json` pins the `shadcn` CLI as a dev dependency so its MCP server starts quickly; it
isn't the site's own dependency list.

## Vendoring notes

Sources are copied in rather than submoduled, so a clone works offline with no init step. Two
upstream repos ship the same skills several times over and were trimmed to one copy each:

- `claudedesignskills` ships its 23 skills four times (`.claude/`, `.factory/`,
  `plugins/individual/`, `plugins/bundles/`); only `plugins/bundles/` is vendored.
- `vercel-labs/agent-skills` — only `skills/` is vendored, not the `packages/` build tooling
  or the per-skill `.zip` archives.

Everything else is upstream-intact, licenses included.
