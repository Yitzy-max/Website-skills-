# Website build rules

## MCP servers

This repo ships three MCP servers in `.mcp.json`. `enableAllProjectMcpServers`
is on in `.claude/settings.json`, so they load automatically — no approval
prompt.

| Server | Use it for |
| --- | --- |
| `motionsites` | **Every website build. Check it first.** |
| `shadcn` | Base components (buttons, forms, dialogs, tables) |
| `magicuidesign-mcp` | Animated / marketing components |

### motionsites is the default

Whenever the task is building, redesigning, or adding a page or section to a
website, check the `motionsites` tools before hand-writing markup or reaching
for another source. Only fall back to `shadcn`, `magicuidesign-mcp`, or
writing it yourself when `motionsites` has nothing that fits — and say so when
that happens.

The server is HTTP transport and requires authentication. If its tools are
missing or a call returns an auth error, stop and tell the user to run `/mcp`,
select `motionsites`, and authenticate. Do not silently build the site without
it.

## Design skills

Three plugins are enabled for this repo: `ui-ux-pro-max`, `impeccable`, and
`frontend-design`. Use them for styling and layout decisions instead of
defaulting to generic AI-looking output.

## Who these sites are for

Small local businesses — barbers, electricians, med spas, hair and nail
salons, solar. Simple, information-first sites. Usually a few sections, clear
service list, and one obvious way to get in touch (form, call button, or
booking link).

Build accordingly:

- Fast and light. These get opened on phones, on cell data.
- The contact path is the point — make it impossible to miss.
- No bloated multi-product e-commerce patterns unless asked.
- Copy sounds like a person wrote it. Not salesy, not corporate, not AI.
