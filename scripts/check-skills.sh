#!/usr/bin/env bash
# Health check for the vendored skill + MCP stack in this repo.
# Verifies every plugin in the marketplace resolves to real skills on disk,
# every plugin named in settings.json exists, and the MCP servers are configured.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

python3 - "$@" <<'PYEOF'
import json, os, sys

fail = 0
def bad(msg):
    global fail
    fail += 1
    print(f"  FAIL  {msg}")

def load(path):
    try:
        return json.load(open(path))
    except Exception as e:
        bad(f"{path}: {e}")
        return None

print("== marketplace ==")
mkt = load(".claude-plugin/marketplace.json")
plugins = {}
if mkt:
    for p in mkt.get("plugins", []):
        name, src = p["name"], p["source"]
        if not os.path.isdir(src):
            bad(f"{name}: source not found -> {src}")
            continue
        if "skills" in p:
            found = []
            for s in p["skills"]:
                d = os.path.normpath(os.path.join(src, s))
                if os.path.isfile(os.path.join(d, "SKILL.md")):
                    found.append(d)
                else:
                    bad(f"{name}: skill missing -> {d}")
        else:
            found = [r for r, _, f in os.walk(src) if "SKILL.md" in f]
            if not found:
                bad(f"{name}: no SKILL.md found under {src}")
        plugins[name] = found
        print(f"  ok    {name:<24} {len(found):>2} skills")

print("== settings ==")
st = load(".claude/settings.json")
on = off = 0
if st:
    for key, enabled in st.get("enabledPlugins", {}).items():
        pname = key.split("@")[0]
        if pname not in plugins:
            bad(f"settings references unknown plugin: {key}")
            continue
        if enabled: on += 1
        else: off += 1
    mkts = st.get("extraKnownMarketplaces", {})
    if "website-skills" not in mkts:
        bad("settings is missing the website-skills marketplace entry")
    else:
        print("  ok    marketplace 'website-skills' registered")
    print(f"  ok    {on} plugins enabled, {off} installed but disabled")

print("== skill names ==")
names, dupes = {}, 0
for pname, dirs in plugins.items():
    enabled = st and st.get("enabledPlugins", {}).get(f"{pname}@website-skills", False)
    if not enabled:
        continue
    for d in dirs:
        n = None
        for line in open(os.path.join(d, "SKILL.md"), encoding="utf-8", errors="replace"):
            if line.startswith("name:"):
                n = line.split(":", 1)[1].strip()
                break
        if not n:
            bad(f"{d}/SKILL.md has no name in frontmatter")
            continue
        if n in names:
            bad(f"duplicate skill name '{n}' in {pname} and {names[n]}")
            dupes += 1
        else:
            names[n] = pname
print(f"  ok    {len(names)} uniquely-named skills active, {dupes} collisions")

print("== mcp servers ==")
seen = set()
for path in (".mcp.json", "skills/magic-21st/.mcp.json"):
    cfg = load(path) if os.path.isfile(path) else None
    if cfg is None:
        if path == ".mcp.json":
            bad("no .mcp.json at repo root")
        continue
    for name, conf in cfg.get("mcpServers", {}).items():
        if name in seen:
            bad(f"MCP server '{name}' registered twice")
        seen.add(name)
        how = conf.get("url") or " ".join([conf.get("command", "")] + conf.get("args", []))
        print(f"  ok    {name:<24} {how}")
if "21st" in seen and not os.environ.get("API_KEY_21ST"):
    print("  WARN  API_KEY_21ST is not set - 21st.dev component search/generation will not work.")
    print("        Free key: https://21st.dev/mcp   then: export API_KEY_21ST=...")

print()
print("FAILURES:", fail)
sys.exit(1 if fail else 0)
PYEOF
