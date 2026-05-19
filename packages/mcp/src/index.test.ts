import { describe, expect, it, vi } from "vitest";
import { createRequestHandler, type HomekitBridge, TOOLS } from "./index";

type ToolResponse = {
  isError?: boolean;
  content: Array<{ type: string; text: string }>;
};

function createBridge(overrides: Partial<HomekitBridge> = {}) {
  const bridge: HomekitBridge = {
    listAccessories: vi.fn(async () => [
      { name: "Desk Lamp", room: "Office", state: { on: true } },
    ]),
    getAccessory: vi.fn(async () => ({ name: "Desk Lamp", state: { on: true } })),
    setAccessory: vi.fn(async () => ({ success: true, name: "Desk Lamp", value: false })),
    activateScene: vi.fn(async () => ({ success: true, scene: "Movie Night" })),
    listScenes: vi.fn(async () => [{ name: "Movie Night" }]),
    createScene: vi.fn(async () => ({
      name: "Focus",
      accessories: [{ name: "Desk Lamp", value: true }],
    })),
    listAutomations: vi.fn(async () => [{ name: "Goodnight" }]),
    runAutomation: vi.fn(async () => ({ success: true, automation: "Goodnight" })),
    ...overrides,
  };
  return bridge;
}

async function callTool(bridge: HomekitBridge, name: string, args: Record<string, unknown> = {}) {
  const handleRequest = createRequestHandler(bridge);
  return handleRequest({
    method: "tools/call",
    params: { name, arguments: args },
  });
}

function parseToolText(result: unknown) {
  const toolResult = result as ToolResponse;
  expect(toolResult.isError).toBeUndefined();
  expect(toolResult.content).toHaveLength(1);
  expect(toolResult.content[0].type).toBe("text");
  return JSON.parse(toolResult.content[0].text);
}

describe("homekit-mcp request handling", () => {
  it("returns server metadata on initialize", async () => {
    const handleRequest = createRequestHandler(createBridge());

    await expect(handleRequest({ method: "initialize" })).resolves.toMatchObject({
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "homekit-mcp", version: "1.0.0" },
    });
  });

  it("lists all advertised Homekit tools", async () => {
    const handleRequest = createRequestHandler(createBridge());

    await expect(handleRequest({ method: "tools/list" })).resolves.toEqual({ tools: TOOLS });
    expect(TOOLS.map((tool) => tool.name)).toEqual([
      "homekit_list_accessories",
      "homekit_get_accessory",
      "homekit_set_accessory",
      "homekit_activate_scene",
      "homekit_list_scenes",
      "homekit_create_scene",
      "homekit_list_automations",
      "homekit_run_automation",
    ]);
  });

  it("delegates accessory and scene tool calls to the bridge", async () => {
    const bridge = createBridge();

    expect(parseToolText(await callTool(bridge, "homekit_list_accessories", { room: "Office" }))).toEqual([
      { name: "Desk Lamp", room: "Office", state: { on: true } },
    ]);
    expect(parseToolText(await callTool(bridge, "homekit_get_accessory", { name: "Desk Lamp" }))).toEqual({
      name: "Desk Lamp",
      state: { on: true },
    });
    expect(
      parseToolText(await callTool(bridge, "homekit_set_accessory", { name: "Desk Lamp", value: false })),
    ).toEqual({ success: true, name: "Desk Lamp", value: false });
    expect(parseToolText(await callTool(bridge, "homekit_activate_scene", { name: "Movie Night" }))).toEqual({
      success: true,
      scene: "Movie Night",
    });
    expect(
      parseToolText(
        await callTool(bridge, "homekit_create_scene", {
          name: "Focus",
          accessories: [{ name: "Desk Lamp", value: true }],
        }),
      ),
    ).toEqual({ name: "Focus", accessories: [{ name: "Desk Lamp", value: true }] });

    expect(bridge.listAccessories).toHaveBeenCalledWith({ room: "Office" });
    expect(bridge.getAccessory).toHaveBeenCalledWith({ name: "Desk Lamp" });
    expect(bridge.setAccessory).toHaveBeenCalledWith({ name: "Desk Lamp", value: false });
    expect(bridge.activateScene).toHaveBeenCalledWith({ name: "Movie Night" });
    expect(bridge.createScene).toHaveBeenCalledWith({
      name: "Focus",
      accessories: [{ name: "Desk Lamp", value: true }],
    });
  });

  it("delegates automation tool calls to the bridge", async () => {
    const bridge = createBridge();

    expect(parseToolText(await callTool(bridge, "homekit_list_automations"))).toEqual([
      { name: "Goodnight" },
    ]);
    expect(parseToolText(await callTool(bridge, "homekit_run_automation", { name: "Goodnight" }))).toEqual({
      success: true,
      automation: "Goodnight",
    });

    expect(bridge.listAutomations).toHaveBeenCalledWith({});
    expect(bridge.runAutomation).toHaveBeenCalledWith({ name: "Goodnight" });
  });

  it("uses the default placeholder bridge for every advertised tool", async () => {
    const handleRequest = createRequestHandler();

    for (const tool of TOOLS) {
      await expect(
        handleRequest({
          method: "tools/call",
          params: { name: tool.name, arguments: { source: "test" } },
        }),
      ).resolves.toMatchObject({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                message: "Delegated to Homekit macOS app IPC bridge",
                tool: tool.name,
                arguments: { source: "test" },
              },
              null,
              2,
            ),
          },
        ],
      });
    }
  });

  it("returns shaped tool errors for missing auth, unknown accessories, and invalid values", async () => {
    const handleRequest = createRequestHandler(
      createBridge({
        listAccessories: vi.fn(async () => {
          throw new Error("Homekit authorization is not set up");
        }),
        getAccessory: vi.fn(async () => {
          throw new Error("Accessory not found: Garage Door");
        }),
        setAccessory: vi.fn(async () => {
          throw new Error("Invalid value for Desk Lamp: maybe");
        }),
      }),
    );

    await expect(
      handleRequest({
        method: "tools/call",
        params: { name: "homekit_list_accessories", arguments: {} },
      }),
    ).resolves.toMatchObject({
      isError: true,
      content: [{ type: "text", text: "Homekit authorization is not set up" }],
    });
    await expect(
      handleRequest({
        method: "tools/call",
        params: { name: "homekit_get_accessory", arguments: { name: "Garage Door" } },
      }),
    ).resolves.toMatchObject({
      isError: true,
      content: [{ type: "text", text: "Accessory not found: Garage Door" }],
    });
    await expect(
      handleRequest({
        method: "tools/call",
        params: { name: "homekit_set_accessory", arguments: { name: "Desk Lamp", value: "maybe" } },
      }),
    ).resolves.toMatchObject({
      isError: true,
      content: [{ type: "text", text: "Invalid value for Desk Lamp: maybe" }],
    });
  });

  it("returns a shaped error for unknown tool calls", async () => {
    await expect(callTool(createBridge(), "homekit_unknown_tool")).resolves.toMatchObject({
      isError: true,
      content: [{ type: "text", text: "Unknown tool: homekit_unknown_tool" }],
    });
  });

  it("validates tool names and normalizes invalid argument payloads", async () => {
    const bridge = createBridge();
    const handleRequest = createRequestHandler(bridge);

    await expect(handleRequest({ method: "tools/call", params: {} })).resolves.toMatchObject({
      isError: true,
      content: [{ type: "text", text: "Tool name is required" }],
    });
    expect(
      parseToolText(
        await handleRequest({
          method: "tools/call",
          params: { name: "homekit_list_accessories", arguments: ["not", "an", "object"] },
        }),
      ),
    ).toEqual([{ name: "Desk Lamp", room: "Office", state: { on: true } }]);
    expect(bridge.listAccessories).toHaveBeenCalledWith({});
  });

  it("rejects unknown JSON-RPC methods", async () => {
    const handleRequest = createRequestHandler(createBridge());

    await expect(handleRequest({ method: "resources/list" })).rejects.toThrow(
      "Unknown method: resources/list",
    );
  });
});
