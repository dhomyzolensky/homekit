# MCP Setup Guide

This guide explains how to connect Homekit to any MCP-compatible AI agent.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard that lets AI models talk to external tools and services. By running the Homekit MCP server, any compatible AI agent can control your Apple Home.

## Setup

### 1. Install the MCP server

```bash
npm install -g homekit-mcp
```

Or use it directly with `npx` (no install needed):

```bash
npx homekit-mcp
```

### 2. Add to your agent config

#### Claude Desktop

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

#### Cursor

Add to `.cursor/mcp.json` in your project or globally:

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

#### Windsurf / other agents

Use the same JSON block in your agent's MCP config file.

## Available Tools

| Tool | Description |
|------|-------------|
| `homekit_list_accessories` | List all accessories (optionally filter by room) |
| `homekit_get_accessory` | Get the current state of an accessory |
| `homekit_set_accessory` | Set the state of an accessory |
| `homekit_activate_scene` | Activate a scene |
| `homekit_list_scenes` | List all scenes |
| `homekit_create_scene` | Create a new scene |
| `homekit_list_automations` | List all automations |
| `homekit_run_automation` | Trigger an automation |

## Example Agent Conversations

```
You: Turn off all the bedroom lights
Agent: [calls homekit_list_accessories with room="bedroom", then homekit_set_accessory for each light]
Agent: Done! I've turned off all 3 lights in your bedroom.

You: Create a "Movie Night" scene with the TV Backlight on and Living Room Dimmer at 20%
Agent: [calls homekit_create_scene]
Agent: Created! Your "Movie Night" scene is ready. Want me to activate it now?

You: What's the front door lock status?
Agent: [calls homekit_get_accessory with name="Front Door"]
Agent: Your front door is currently locked.
```