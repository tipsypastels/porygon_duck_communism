import { assert } from "@std/assert";
import { putApplicationGuildCommands } from "../rest.ts";
import { Command, CommandCell, CommandDataBuilder } from "./mod.ts";
import * as Discord from "discord-api-types";

const CACHE_FILE = new URL("../../.command-cache", import.meta.url).pathname;

const REGISTERED_BY_NAME = new Map<string, CommandCell>();
const REGISTERED_BY_ID = new Map<string, CommandCell>();
const REGISTERED_BY_COMMAND = new Map<Command, CommandCell>();

const UNREGISTERED: Command[] = [];

export function addCommand(command: Command) {
  UNREGISTERED.push(command);
}

export async function registerCommands() {
  const commandRegData: Discord.RESTPostAPIApplicationCommandsJSONBody[] = [];
  const commandsToRegister = takeUnregistered();

  for (const command of commandsToRegister) {
    const builder = new CommandDataBuilder(command.name);
    command.register(builder);
    commandRegData.push(builder.build());
  }

  const responseData = await putApplicationGuildCommands(commandRegData);
  const cacheFileJson: Record<string, string> = {};

  for (let i = 0; i < responseData.length; i++) {
    // assumes that the output is in order
    const command = commandsToRegister[i];
    const commandResponseData = responseData[i];
    const cell: CommandCell = { command, data: commandResponseData };

    cacheFileJson[commandResponseData.name] = commandResponseData.id;
    setRegistered(cell);
  }

  await Deno.writeTextFile(CACHE_FILE, JSON.stringify(cacheFileJson));
}

export async function hydrateCommands() {
  const cacheFileText = await Deno.readTextFile(CACHE_FILE);
  const cacheFileJson: Record<string, string> = JSON.parse(cacheFileText);
  const commandsToHydrate = takeUnregistered();

  for (const command of commandsToHydrate) {
    const builder = new CommandDataBuilder(command.name);
    command.register(builder);
    const name = builder.getName();
    const id: string | undefined = cacheFileJson[name];

    assert(id, `Command '${name}' not found for hydration`);
    setRegistered({ command, data: { id, name } });
  }

  console.log(REGISTERED_BY_COMMAND);
}

function setRegistered(cell: CommandCell) {
  REGISTERED_BY_NAME.set(cell.data.name, cell);
  REGISTERED_BY_ID.set(cell.data.id, cell);
  REGISTERED_BY_COMMAND.set(cell.command, cell);
}

function takeUnregistered(): Command[] {
  const out = [...UNREGISTERED];
  UNREGISTERED.length = 0;
  return out;
}
