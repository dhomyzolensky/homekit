#!/usr/bin/env node
/**
 * homekit-cli — Control your Apple Home from the terminal
 * https://homekit.builders
 */

const [,, command, ...args] = process.argv;

const COMMANDS: Record<string, string> = {
  auth: "Authorize with Apple Home",
  list: "List all accessories",
  get: "Get accessory state",
  set: "Set accessory state",
  scene: "Manage and activate scenes",
  automation: "Manage automations",
  home: "Switch between Homes",
};

function printHelp() {
  console.log(`
homekit — Control your Apple Home from the command line

Usage: homekit <command> [options]

Commands:
  auth                    Authorize with Apple Home
  list                    List all accessories
  get <name>              Get accessory state
  set <name> <value>      Set accessory state (on/off/0-100)
  scene [name]            Activate a scene
  scene create <name>     Create a new scene
  scene import <file>     Import scenes from JSON
  scene export            Export all scenes to JSON
  automation list         List all automations
  automation run <name>   Trigger an automation
  home list               List all Homes
  home switch <name>      Switch active Home

Options:
  --home <name>   Target a specific Home
  --json          Output as JSON
  --verbose       Verbose logging
  --help          Show this help

Website: https://homekit.builders
  `);
}

async function main() {
  if (!command || command === "--help" || command === "help") {
    printHelp();
    process.exit(0);
  }

  if (!COMMANDS[command]) {
    console.error(`Unknown command: ${command}`);
    console.error(`Run "homekit --help" to see available commands.`);
    process.exit(1);
  }

  // Commands are handled via the macOS app IPC bridge
  console.log(`homekit ${command} ${args.join(" ")}`);
  console.log("Connecting to Homekit macOS app...");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});