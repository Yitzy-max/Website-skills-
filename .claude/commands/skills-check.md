---
description: Verify every vendored skill and MCP server in this repo is installed, enabled, and resolvable.
---

Run the health check and report the results:

```bash
bash scripts/check-skills.sh
```

Then confirm the MCP servers are actually connected by listing the tools available from
`shadcn`, `magicuidesign-mcp`, and `21st`. If `21st` has no tools, `API_KEY_21ST` is not set —
tell the user to get a free key at https://21st.dev/mcp and export it.
