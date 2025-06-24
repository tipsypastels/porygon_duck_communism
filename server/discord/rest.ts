import * as D from "discord-api-types";
import { Routes as R } from "discord-api-types";
import { REST } from "@discordjs/rest";
import { BOT_ID, BOT_TOKEN, GUILD_ID } from "./env.ts";

const rest = new REST().setToken(BOT_TOKEN);

export async function postApplicationGuildCommand(
  command: D.RESTPostAPIApplicationCommandsJSONBody,
) {
  return await rest.post(D.Routes.applicationGuildCommands(BOT_ID, GUILD_ID), {
    body: command,
  }) as D.APIApplicationCommand;
}

export async function putApplicationGuildCommands(
  commands: D.RESTPostAPIApplicationCommandsJSONBody[],
) {
  return await rest.put(R.applicationGuildCommands(BOT_ID, GUILD_ID), {
    body: commands,
  }) as D.APIApplicationCommand[];
}

export async function postInteractionCallback(
  id: string,
  token: string,
  callback: D.APIInteractionResponse,
) {
  await rest.post(R.interactionCallback(id, token), { body: callback });
}
