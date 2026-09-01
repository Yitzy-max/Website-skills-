---
title: Magic UI MCP Server
description: Learn how to use the Model Context Protocol with Magic UI.
date: 2025-04-16
source: https://magicui.design/docs/mcp
---

Magic UI has an official MCP server.

[MCP](https://modelcontextprotocol.com/) is an open protocol that standardizes how
applications provide context to LLMs.

This is useful for Magic UI because it gives an AI-assisted IDE (or Claude) direct
access to all Magic UI components, so it can generate code with minimal errors.

## Install

### CLI

Run the installer for your tool of choice, then restart your IDE:

```bash
# Cursor
npx @magicuidesign/cli@latest install cursor

# Windsurf
npx @magicuidesign/cli@latest install windsurf

# Claude
npx @magicuidesign/cli@latest install claude

# Cline
npx @magicuidesign/cli@latest install cline

# Roo-Cline
npx @magicuidesign/cli@latest install roo-cline
```

### Manual

Add the following to your MCP config file, then restart your IDE:

```json
{
  "mcpServers": {
    "magicuidesign-mcp": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    }
  }
}
```

## Usage

Once installed, you can ask your IDE to use any Magic UI component directly, e.g.:

- "Add a blur fade text animation"
- "Add a grid background"
- "Add a vertical marquee of logos"
