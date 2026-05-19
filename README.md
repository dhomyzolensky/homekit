<div align="center">

<img src="https://homekit.builders/icon.png" alt="Homekit" width="120" height="120" />

# Homekit

**Control your Apple Home with any AI agent.**

CLI · MCP Server · @openclaw Plugin · macOS App

[![CI](https://github.com/dhomyzolensky/homekit/actions/workflows/ci.yml/badge.svg)](https://github.com/dhomyzolensky/homekit/actions/workflows/ci.yml)
[![npm homekit-cli](https://img.shields.io/npm/v/homekit-cli?label=homekit-cli&color=cb3837&logo=npm)](https://www.npmjs.com/package/homekit-cli)
[![npm homekit-mcp](https://img.shields.io/npm/v/homekit-mcp?label=homekit-mcp&color=cb3837&logo=npm)](https://www.npmjs.com/package/homekit-mcp)
[![App Store](https://img.shields.io/badge/App_Store-macOS-black?logo=apple&logoColor=white)](https://apps.apple.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-6c47ff?logo=anthropic&logoColor=white)](https://modelcontextprotocol.io)
[![GitHub stars](https://img.shields.io/github/stars/dhomyzolensky/homekit?style=social)](https://github.com/dhomyzolensky/homekit/stargazers)

[Website](https://homekit.builders) · [Documentation](https://homekit.builders/docs) · [Report Bug](https://github.com/dhomyzolensky/homekit/issues/new?template=bug_report.yml) · [Request Feature](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml) · [Changelog](CHANGELOG.md)

</div>

---

## What is Homekit?

Homekit is the missing bridge between Apple Home and AI agents. It exposes your entire smart home — lights, locks, thermostats, scenes, automations — as tools that any AI agent can use.

- **Talk to your home** from Claude, ChatGPT, Cursor, or any MCP-compatible agent
- **Automate from scripts** with the full-featured CLI
- **Build on top of it** with the @openclaw plugin and open TypeScript packages
- **Manage visually** with the native macOS App Store app

This is the first macOS app that bridges Apple's HomeKit framework to the Model Context Protocol — making Apple Home fully programmable by AI.

---

## Quick start

### Install the CLI

```bash
npm install -g homekit-cli
```

### Authorize

```bash
homekit auth
```

This opens the macOS companion app to grant access to your Apple Home. Takes about 10 seconds.

### Control your home

```bash
homekit list                                    # List all accessories
homekit set "Living Room Lights" on             # Turn on lights
homekit set "Living Room Dimmer" 40             # Set brightness to 40%
homekit scene "Good Morning"                    # Activate a scene
homekit scene create "Movie Night" \
  --accessories "TV Backlight:on" \
             "Main Lights:off" \
             "Lamp:20"                          # Create a scene
homekit scene export > my-scenes.json           # Export all scenes
homekit scene import ./scenes.json              # Import scenes
homekit automation run "Goodnight"              # Trigger an automation
```

---

## MCP Server — AI agent integration

Connect any MCP-compatible agent to your Apple Home in under 2 minutes.

### Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "homekit": {
      "command": "npx",
      "args": ["homekit-mcp"]
    }
  }
}
```

### Add to Cursor / Windsurf

Edit `.cursor/mcp.json` (or your agent's MCP config):

```json
{
  "mcpServers": {
    "homekit": {
      "command": "npx",
      "args": ["homekit-mcp"]
    }
  }
}
```

Restart your agent and start talking to your home:

> *"Turn off all the lights in the bedroom"*
> *"Set the thermostat to 72°F"*
> *"Create a scene called Dinner Party with warm lights at 30%"*
> *"What's the status of the front door lock?"*
> *"Run the Goodnight automation"*

### Available MCP tools

| Tool | Description |
|------|-------------|
| `homekit_list_accessories` | List accessories, optionally filtered by room |
| `homekit_get_accessory` | Get the live state of any accessory |
| `homekit_set_accessory` | Control any accessory (on/off, brightness, temperature) |
| `homekit_activate_scene` | Activate a scene |
| `homekit_list_scenes` | List all scenes |
| `homekit_create_scene` | Create a new scene programmatically |
| `homekit_list_automations` | List all automations |
| `homekit_run_automation` | Trigger an automation |

---

## @openclaw Plugin

```bash
openclaw plugin add homekit
```

Configure in `openclaw.yaml`:

```yaml
plugins:
  - homekit
```

All Homekit capabilities are now available as tools inside any @openclaw agent.

---

## CLI Reference

```
homekit <command> [options]

Commands:
  auth                      Authorize with Apple Home
  list                      List all accessories
  get <name>                Get accessory state
  set <name> <value>        Set accessory state (on/off/0-100)
  scene [name]              Activate a scene
  scene create <name>       Create a new scene
  scene import <file>       Import scenes from a JSON file
  scene export              Export all scenes as JSON
  automation list           List all automations
  automation run <name>     Trigger an automation
  home list                 List all Homes
  home switch <name>        Switch active Home

Global options:
  --home <name>             Target a specific Home
  --json                    Output as JSON (pipe-friendly)
  --verbose                 Verbose logging
  --version                 Show version
  --help                    Show help
```

---

## Packages

This is a monorepo. All packages are published to npm independently.

| Package | Version | Description |
|---------|---------|-------------|
| [`homekit-cli`](packages/cli) | [![npm](https://img.shields.io/npm/v/homekit-cli?color=cb3837)](https://www.npmjs.com/package/homekit-cli) | Terminal interface |
| [`homekit-mcp`](packages/mcp) | [![npm](https://img.shields.io/npm/v/homekit-mcp?color=cb3837)](https://www.npmjs.com/package/homekit-mcp) | MCP server for AI agents |
| [`@openclaw/homekit`](packages/openclaw) | [![npm](https://img.shields.io/npm/v/@openclaw/homekit?color=cb3837)](https://www.npmjs.com/package/@openclaw/homekit) | @openclaw plugin |

---

## Architecture

```
homekit/
├── packages/
│   ├── cli/           homekit-cli — Terminal interface
│   ├── mcp/           homekit-mcp — MCP server (stdio transport)
│   └── openclaw/      @openclaw/homekit — Plugin
├── apps/
│   └── macos/         Native macOS App (Swift + SwiftUI) — App Store
└── docs/              Guides and API reference
```

The CLI and MCP server communicate with Apple Home through the macOS companion app using a local IPC bridge. This bridge has privileged access to HomeKit — the CLI and MCP packages themselves are pure Node.js and don't require special entitlements.

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dhomyzolensky/homekit&type=Date)](https://star-history.com/#dhomyzolensky/homekit&Date)

---

## Contributing

Contributions are welcome — we have [good first issues](https://github.com/dhomyzolensky/homekit/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) ready to pick up. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

For security issues, see [SECURITY.md](SECURITY.md).

---

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/dhomyzolensky">
          <img src="https://github.com/dhomyzolensky.png" width="100px;" alt="Dhomy Zolensky"/><br />
          <sub><b>Dhomy Zolensky</b></sub>
        </a><br />
        <a title="Code">💻</a>
        <a title="Design">🎨</a>
        <a title="Ideas">🤔</a>
      </td>
    </tr>
  </tbody>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## Requirements

- macOS 13 (Ventura) or later
- Apple Home set up on your Mac
- Node.js 18+ (for CLI and MCP server)
- Homekit macOS app (for initial authorization)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by [Dhomy Zolensky](https://github.com/dhomyzolensky) · [homekit.builders](https://homekit.builders)

⭐ Star this repo if Homekit is useful to you — it helps others find it!

</div>
