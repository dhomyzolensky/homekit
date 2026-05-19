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

type JsonObject = Record<string, unknown>;

export interface JsonRpcRequest {
  id?: string | number | null;
  method: string;
  params?: JsonObject;
}

export interface HomekitBridge {
  listAccessories(args: JsonObject): Promise<unknown>;
  getAccessory(args: JsonObject): Promise<unknown>;
  setAccessory(args: JsonObject): Promise<unknown>;
  activateScene(args: JsonObject): Promise<unknown>;
  listScenes(args: JsonObject): Promise<unknown>;
  createScene(args: JsonObject): Promise<unknown>;
  listAutomations(args: JsonObject): Promise<unknown>;
  runAutomation(args: JsonObject): Promise<unknown>;
}

type ToolHandler = (args: JsonObject) => Promise<unknown>;

export const TOOLS = [
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

const defaultBridge: HomekitBridge = {
  async listAccessories(args) {
    return placeholderResult("homekit_list_accessories", args);
  },
  async getAccessory(args) {
    return placeholderResult("homekit_get_accessory", args);
  },
  async setAccessory(args) {
    return placeholderResult("homekit_set_accessory", args);
  },
  async activateScene(args) {
    return placeholderResult("homekit_activate_scene", args);
  },
  async listScenes(args) {
    return placeholderResult("homekit_list_scenes", args);
  },
  async createScene(args) {
    return placeholderResult("homekit_create_scene", args);
  },
  async listAutomations(args) {
    return placeholderResult("homekit_list_automations", args);
  },
  async runAutomation(args) {
    return placeholderResult("homekit_run_automation", args);
  },
};

const handlerNames: Record<string, keyof HomekitBridge> = {
  homekit_list_accessories: "listAccessories",
  homekit_get_accessory: "getAccessory",
  homekit_set_accessory: "setAccessory",
  homekit_activate_scene: "activateScene",
  homekit_list_scenes: "listScenes",
  homekit_create_scene: "createScene",
  homekit_list_automations: "listAutomations",
  homekit_run_automation: "runAutomation",
};

export function createRequestHandler(bridge: HomekitBridge = defaultBridge) {
  const handlers = Object.fromEntries(
    Object.entries(handlerNames).map(([toolName, bridgeMethod]) => [
      toolName,
      bridge[bridgeMethod].bind(bridge),
    ]),
  ) as Record<string, ToolHandler>;

  return async function handleRequest(request: JsonRpcRequest): Promise<unknown> {
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
      const { name, arguments: toolArgs } = params ?? {};
      if (typeof name !== "string") {
        return toolError("Tool name is required");
      }

      const handler = handlers[name];
      if (!handler) {
        return toolError(`Unknown tool: ${name}`);
      }

      try {
        const result = await handler(toJsonObject(toolArgs));
        return toolResult(result);
      } catch (err) {
        return toolError(err instanceof Error ? err.message : String(err));
      }
    }

    throw new Error(`Unknown method: ${method}`);
  };
}

export const handleRequest = createRequestHandler();

function placeholderResult(toolName: string, args: JsonObject) {
  return {
    message: "Delegated to Homekit macOS app IPC bridge",
    tool: toolName,
    arguments: args,
  };
}

function toolResult(result: unknown) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

function toolError(message: string) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}

function toJsonObject(value: unknown): JsonObject {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonObject;
  }
  return {};
}

function startStdioTransport() {
  process.stdin.setEncoding("utf8");
  let buffer = "";

  process.stdin.on("data", async (chunk) => {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const request = JSON.parse(line) as JsonRpcRequest;
        const result = await handleRequest(request);
        const response = { jsonrpc: "2.0", id: request.id, result };
        process.stdout.write(`${JSON.stringify(response)}\n`);
      } catch (err) {
        const response = {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: err instanceof Error ? err.message : String(err),
          },
        };
        process.stdout.write(`${JSON.stringify(response)}\n`);
      }
    }
  });
}

if (require.main === module) {
  startStdioTransport();
}
