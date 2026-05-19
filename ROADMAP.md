# Roadmap

This document outlines the planned direction for Homekit. Priorities may shift based on community feedback — open an issue or vote with 👍 on existing ones to influence what ships next.

> **Legend:** ✅ Done · 🚧 In progress · 🗓 Planned · 💭 Exploring

---

## v1.0 — Foundation ✅

_Released May 2025_

- ✅ `homekit-cli` — full terminal interface for Apple Home
- ✅ `homekit-mcp` — MCP server (stdio transport) for Claude Desktop, Cursor, Windsurf
- ✅ `@openclaw/homekit` — @openclaw plugin
- ✅ macOS companion app on the App Store
- ✅ Scene create, import, and export as JSON
- ✅ Automation list and trigger
- ✅ Multi-Home support (`homekit home switch`)
- ✅ `--json` flag for pipe-friendly output

---

## v1.1 — Developer Experience 🗓

_Target: Q3 2025_

- 🗓 **Shell completion** — Tab-complete commands and accessory/scene names in bash, zsh, and fish ([#2](https://github.com/dhomyzolensky/homekit/issues/2))
- 🗓 **`homekit rooms`** — List accessories grouped by room ([#1](https://github.com/dhomyzolensky/homekit/issues/1))
- 🗓 **`--dry-run` for scene import** — Preview changes before applying ([#3](https://github.com/dhomyzolensky/homekit/issues/3))
- 🗓 **Windsurf + Zed MCP guides** — Step-by-step setup for more editors ([#4](https://github.com/dhomyzolensky/homekit/issues/4))
- 🗓 **MCP server unit tests** — Full test coverage for all tool handlers ([#5](https://github.com/dhomyzolensky/homekit/issues/5))
- 🗓 **`homekit watch`** — Live-stream accessory state changes to the terminal
- 🗓 **Config file support** — `~/.homekit.json` for default Home, output format, aliases

---

## v1.2 — Power Features 🗓

_Target: Q4 2025_

- 🗓 **Accessory aliases** — Map long accessory names to short aliases (`homekit alias lr "Living Room Lights"`)
- 🗓 **Scheduled commands** — `homekit schedule "08:00" scene "Good Morning"`
- 🗓 **Scene diff** — Show what changed between two scene exports (`homekit scene diff a.json b.json`)
- 🗓 **Accessory groups** — Control multiple accessories at once (`homekit set @lights off`)
- 🗓 **HTTP MCP transport** — Alternative to stdio for remote agent setups
- 🗓 **`homekit status`** — Single-command Home summary (all rooms, states, active scenes)
- 🗓 **Log/history** — Record every command and agent action with timestamps

---

## v2.0 — Platform Expansion 💭

_Target: 2026_

- 💭 **Shortcuts integration** — Trigger Homekit commands from Apple Shortcuts
- 💭 **Menu bar app** — Quick-access Home control without opening the full app
- 💭 **Multi-agent support** — Run multiple simultaneous MCP connections (one per agent)
- 💭 **REST API mode** — Expose a local REST API for custom integrations (`homekit serve`)
- 💭 **Plugin SDK** — Let third-party developers extend Homekit with custom tools and commands
- 💭 **iOS Shortcuts app** — Control Apple Home from iPhone via Homekit agent
- 💭 **Web dashboard** — Browser-based UI for teams and power users

---

## Community Requests 💭

_Not yet scheduled — vote with 👍 on the linked issues_

| Request | Issue |
|---------|-------|
| Support for Matter accessories | [Vote](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml) |
| Windows / Linux CLI (without macOS app) | [Vote](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml) |
| VS Code extension | [Vote](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml) |
| Claude.ai web integration | [Vote](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml) |
| Home energy monitoring | [Vote](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml) |

Have an idea not listed here? [Open a feature request →](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml)

---

## How priorities are set

1. **Security and stability** — bugs and crashes always come first
2. **Community votes** — 👍 reactions on issues are a strong signal
3. **Contributor availability** — items with a linked PR move faster
4. **Strategic fit** — features that strengthen the CLI ↔ MCP ↔ App platform story

This roadmap is a living document. Follow the repo (Watch → Custom → Releases) to get notified when milestones ship.
