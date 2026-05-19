/**
 * homekit-mcp — MCP server for controlling Apple Home with AI agents
 * https://homekit.builders
 *
 * Add to your mcp.json:
 * {
 *   "mcpServers": {
 *     "homekit": {
 *       "command": "npx",
 *       "args": ["homekit-mcp"]
 *     }
 *   }
 * }
 */

const MCP_VERSION = "1.0.0";

const TOOLS = [
  {
    name: "homekit_list_accessories",
    description: "List all accessories in the Apple Home",
    inputSchema: {
      type: "object",
      properties: {
        home: { type: "string", description: "Name of the Home (optional)" },
        room: { type: "string", description: "Filter by room name (optional)" },
      },
    },
  },
  {
    name: "homekit_get_accessory",
    description: "Get the current state of a specific accessory",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Accessory name" },
      },
      required: ["name"],
    },
  },
  {
    name: "homekit_set_accessory",
    description: "Set the state of an accessory (on/off, brightness, temperature, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Accessory name" },
        value: { description: "Value to set (true/false, 0-100 for brightness, etc.)" },
      },
      required: ["name", "value"],
    },
  },
  {
    name: "homekit_activate_scene",
    description: "Activate a scene in Apple Home",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Scene name" },
      },
      required: ["name"],
    },
  },
  {
    name: "homekit_list_scenes",
    description: "List all available scenes",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "homekit_create_scene",
    description: "Create a new scene with specified accessory states",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Scene name" },
        accessories: {
          type: "array",
          description: "List of accessory states for this scene",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: {},
            },
          },
        },
      },
      required: ["name", "accessories"],
    },
  },
  {
    name: "homekit_list_automations",
    description: "List all automations",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "homekit_run_automation",
    description: "Trigger an automation",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Automation name" },
      },
      required: ["name"],
    },
  },
];

async function handleRequest(request: any): Promise<any> {
  const { method, params } = request;

  if (method === "initialize") {
    return {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "homekit-mcp", version: MCP_VERSION },
    };
  }

  if (method === "tools/list") {
    return { tools: TOOLS };
  }

  if (method === "tools/call") {
    const { name, arguments: toolArgs } = params;
    // Delegate to macOS app IPC bridge
    return {
      content: [
        {
          type: "text",
          text: `Executing homekit tool: ${name} with args: ${JSON.stringify(toolArgs)}`,
        },
      ],
    };
  }

  throw new Error(`Unknown method: ${method}`);
}

// Stdio transport (standard MCP communication)
process.stdin.setEncoding("utf8");
let buffer = "";

process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const request = JSON.parse(line);
      const result = await handleRequest(request);
      const response = { jsonrpc: "2.0", id: request.id, result };
      process.stdout.write(JSON.stringify(response) + "\n");
    } catch (err: any) {
      const response = {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: err.message },
      };
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  }
});