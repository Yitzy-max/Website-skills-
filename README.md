# Website Skills

The codebase for websites built with Claude Code. Three design skills are wired up as
**always-on plugins** for this project (see [Auto-activation](#auto-activation) below),
plus two MCP servers for pulling in ready-made UI components.

## Sites in this repo

### `/` — The Caffeine Haven (Howell, NJ)

A cinematic, layered landing page for **The Caffeine Haven**, a quiet specialty coffee
shop on Route 9 in Howell Township, New Jersey (second location in downtown Toms River).

- `index.html` / `css/style.css` / `js/main.js` — no framework, no build step. Serve the
  repo root (`npx http-server -p 4517 .`) or open `index.html`.
- **Hero**: a generated slow-motion pour (milk into a latte, barista's hands, side angle
  matching the supplied reference) plays under the headline. The copy is held back until
  the pour lands, then rises out of clip masks. The hero stays *pinned underneath* the
  page: every later section is a "sheet" that slides over it with its own shadow and
  radius, so the whole site reads as physical layers rather than one flat scroll.
- **Motion**: [Lenis](https://github.com/darkroomengineering/lenis) momentum scroll +
  GSAP `ScrollTrigger`, both vendored in `js/vendor/` (no CDN dependency). Scroll drives:
  the hero receding as the first sheet arrives, a pinned horizontal rail of drinks and
  pastries (vertical scroll becomes sideways travel, each photo drifting at its own rate
  inside its frame), a sticky photograph that swaps as each "why you'll stay" reason
  scrolls past, background parallax on the story band, and word-mask text reveals
  everywhere. Reduced-motion users get the full page with no animation.
- **Type**: Cormorant (light, high-contrast serif, matching the engraved window
  lettering), Instrument Sans for body, DM Mono for hours and labels. Self-hosted in
  `fonts/` via `css/fonts.css`.
- **Content is real**, pulled from the shop's Google listing, Instagram, Yelp, DoorDash
  and the storefront photo: address, phone, hours (Mon–Fri 6–4, Sat–Sun 7–4), the
  toy corner, outdoor seating, signature drinks (brown sugar cinnamon latte, velvet
  vanilla cold brew, banana cream, tiramisu, toasted pistachio, hot toffee crunch,
  s'mores), the bakes, and short review quotes. The "open now" pill in the header and
  the visit section are computed live in New York time.
- **Photography and video** are generated with the Higgsfield MCP (`nano_banana_pro`
  stills, `seedance_2_0_mini` video) and compressed to WebP / H.264 by
  `scripts/fetch-assets.sh`, which the `Fetch generated assets` workflow runs. Swap any
  file in `images/` or `videos/` for the shop's own photography and nothing else changes.
  The hero also has a still poster (`images/hero-poster.webp`) so it never looks empty.

### `/il-giardinello/` — Il Giardinello Di Bacoli (Toms River, NJ)

The earlier image-forward landing page for a family-run Neapolitan ristorante, kept intact
in its own folder. See `il-giardinello/images/README.md` and `il-giardinello/videos/README.md`
for the photo/video slots it expects.

## Skills

### [`skills/ui-ux-pro-max-skill/`](skills/ui-ux-pro-max-skill)
**UI/UX Pro Max** — by [nextlevelbuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

AI-powered design intelligence with 84 UI styles, 192 color palettes, 74 font pairings,
98 UX guidelines, and 25 chart types across 22 tech stacks.

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · License: MIT

### [`skills/impeccable/`](skills/impeccable)
**Impeccable** — by [Paul Bakaus](https://github.com/pbakaus/impeccable)

Design fluency for frontend development: 1 skill with 23 commands
(`/impeccable polish`, `/impeccable audit`, `/impeccable critique`, etc.) plus curated
anti-pattern detection.

- Source: https://github.com/pbakaus/impeccable · Homepage: https://impeccable.style

### [`skills/frontend-design/`](skills/frontend-design)
**Frontend Design** — by Anthropic

Official Claude Code plugin for distinctive, production-grade frontend interfaces that
avoid generic AI aesthetics.

- Source: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design

## Resources

- [`resources/magic-ui-mcp.md`](resources/magic-ui-mcp.md) — Magic UI MCP server notes.
- [`resources/react-bits-mcp.md`](resources/react-bits-mcp.md) — React Bits via shadcn registry.

## Auto-activation

The three skills are registered as Claude Code **plugins** via a local marketplace, so they
load automatically in every session opened in this repo:

- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — declares the local
  marketplace `website-skills`.
- [`.claude/settings.json`](.claude/settings.json) — registers that marketplace and enables
  all three plugins by default.

Verify with `claude plugin list`.

### MCP servers

[`.mcp.json`](.mcp.json) registers two MCP servers, auto-approved for this project:

- **`shadcn`** — `npx shadcn@latest mcp`, with [`components.json`](components.json)'s
  `@react-bits` registry for [React Bits](https://reactbits.dev/) components.
- **`magicuidesign-mcp`** — `npx @magicuidesign/mcp@latest` for [Magic UI](https://magicui.design/).
