import { Command } from "./mod.ts";

const CACHE_FILE = new URL("../../.command-cache", import.meta.url).pathname;

const REGISTERED = new Map<string, Command>();
const UNREGISTERED: Command[] = [];

export function addCommand(command: Command) {
  UNREGISTERED.push(command);
}

export async function registerCommands() {
  console.log(UNREGISTERED.length, "commands to register");
}

export async function readPremadeCommandRegister() {}
