# Homekit

> Control your Apple Home with any AI agent — from the command line.

Homekit lets you use any agent (Claude, ChatGPT, Cursor, and more) to control your Apple Home. It ships with a **CLI**, an **MCP server**, and an **@openclaw plugin**. You can create scenes, trigger automations, manage accessories, and import/export your entire Home setup — all from your terminal or agent.

[![App Store](https://img.shields.io/badge/App_Store-Available-black?logo=apple)](https://apps.apple.com)
[![npm](https://img.shields.io/npm/v/homekit-cli?label=CLI)](https://www.npmjs.com/package/homekit-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![homekit.builders](https://img.shields.io/badge/website-homekit.builders-brightgreen)](https://homekit.builders)

---

## Features

- **CLI** — Control Apple Home from your terminal with simple commands
- **MCP Server** — Plug Homekit into any MCP-compatible AI agent (Claude Desktop, Cursor, etc.)
- **@openclaw Plugin** — First-class integration with the @openclaw agent framework
- **Scene Management** — Create, import, and export scenes programmatically
- **Automation Control** — Trigger and manage automations from code or an agent
- **Accessory Control** — Turn on/off lights, lock doors, adjust thermostats and more
- **App Store macOS App** — Beautiful native macOS companion app

---

## Quick Start

### Install the CLI

```bash
npm install -g homekit-cli
```

### Authenticate

```bash
homekit auth
```

This opens the macOS app to authorize Homekit access to your Apple Home.

### Control your Home

```bash
# List all accessories
homekit list

# Turn on the living room lights
homekit set "Living Room Lights" on

# Activate a scene
homekit scene "Good Morning"

# Create a new scene
homekit scene create "Movie Night" --accessories "TV Backlight:on" "Living Room Dimmer:30%"

# Import scenes from a JSON file
homekit scene import ./scenes.json

# Export all scenes
homekit scene export > scenes.json
```

---

## MCP Server

Add Homekit to any MCP-compatible AI agent (Claude Desktop, Cursor, Windsurf, etc.).

### Setup

Add this to your `mcp.json` or Claude Desktop config:

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

Your agent can now:
- List and control all accessories in your Home
- Activate and create scenes
- Trigger automations
- Query the state of any accessory

### Example agent prompts

```
"Turn off all the lights in the bedroom"
"Create a scene called Dinner Party with warm lighting at 40%"
"What's the temperature on the thermostat?"
"Lock the front door and arm the security system"
```

---

## @openclaw Plugin

```bash
openclaw plugin add homekit
```

Then in your openclaw config:

```yaml
plugins:
  - homekit
```

The plugin exposes all Homekit capabilities as tools inside @openclaw agents.

---

## CLI Reference

```
homekit <command> [options]

Commands:
  auth                    Authorize with Apple Home
  list                    List all accessories
  get <name>              Get accessory state
  set <name> <value>      Set accessory state (on/off/number)
  scene [name]            Activate a scene
  scene create <name>     Create a new scene
  scene import <file>     Import scenes from JSON
  scene export            Export all scenes to JSON
  automation list         List all automations
  automation run <name>   Trigger an automation
  home list               List all Homes
  home switch <name>      Switch active Home

Options:
  --home <name>           Target a specific Home
  --json                  Output as JSON
  --verbose               Verbose output
  --help                  Show help
```

---

## macOS App

Homekit is also available as a native macOS app on the **App Store**.

The app provides:
- Visual scene builder and editor
- Accessory dashboard with live status
- CLI & MCP authorization manager
- Import/export tools with drag-and-drop

---

## Architecture

```
homekit/
├── packages/
│   ├── cli/          # homekit-cli — Terminal interface
│   ├── mcp/          # homekit-mcp — MCP server for AI agents
│   └── openclaw/     # @openclaw/homekit — openclaw plugin
├── apps/
│   └── macos/        # Native macOS App Store app (Swift/SwiftUI)
└── docs/             # Documentation
```

---

## Requirements

- macOS 13 (Ventura) or later
- Apple Home configured
- Node.js 18+ (for CLI and MCP server)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Links

- Website: [homekit.builders](https://homekit.builders)
- macOS App: App Store
- MCP Protocol: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- @openclaw: [openclaw.dev](https://openclaw.dev)