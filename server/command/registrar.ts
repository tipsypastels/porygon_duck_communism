import { rest } from "../rest.ts";
import { Routes } from "discord-api-types";
import { Command } from "./mod.ts";
import { BOT_TOKEN } from "../env.ts";

const CACHE_FILE = new URL("../../.command-cache", import.meta.url).pathname;

const REGISTERED = new Map<string, Command>();
const UNREGISTERED: Command[] = [];

export function addCommand(command: Command) {
  UNREGISTERED.push(command);
}

export async function registerCommands() {
}

export async function readPremadeCommandRegister() {
}
