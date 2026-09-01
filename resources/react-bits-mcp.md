---
title: React Bits MCP (via shadcn)
description: Use the React Bits component registry through the shadcn MCP server.
source: https://reactbits.dev/
---

[React Bits](https://reactbits.dev/) publishes its components as a
[shadcn](https://ui.shadcn.com/) registry, so they can be pulled straight into a
project through shadcn's CLI/MCP tooling — no manual copy-pasting required.

## Setup

Add the React Bits registry to your shadcn config (`components.json`):

```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

Then initialize the shadcn MCP server for your client:

```bash
npx shadcn@latest mcp init --client claude
```

## Usage

Once the MCP server is running, you can ask Claude to browse and install
components directly from the registry, e.g.:

- "Show me all the available backgrounds from the React Bits registry"
- "Add the Dither background from React Bits to the page, make it purple"
- "Add a new section which fades in on scroll using FadeContent from React Bits"
