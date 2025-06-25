import * as D from "discord-api-types";
import { Routes as R } from "discord-api-types";
import { REST } from "@discordjs/rest";
import { BOT_ID, BOT_TOKEN, GUILD_ID } from "./env.ts";
import { Collection } from "@discordjs/collection";

const rest = new REST().setToken(BOT_TOKEN);

export async function getGuildMembers({ limit = 1000 } = {}) {
  return collect(
    await rest.get(R.guildMembers(GUILD_ID), {
      query: new URLSearchParams({ limit: limit.toString() }),
    }) as D.APIGuildMember[],
    (m) => m.user.id,
  );
}

export async function postApplicationGuildCommand(
  command: D.RESTPostAPIApplicationCommandsJSONBody,
) {
  return await rest.post(R.applicationGuildCommands(BOT_ID, GUILD_ID), {
    body: command,
  }) as D.APIApplicationCommand;
}

export async function putApplicationGuildCommands(
  commands: D.RESTPostAPIApplicationCommandsJSONBody[],
) {
  return collect(
    await rest.put(R.applicationGuildCommands(BOT_ID, GUILD_ID), {
      body: commands,
    }) as D.APIApplicationCommand[],
    (c) => c.id,
  );
}

export async function postInteractionCallback(
  id: string,
  token: string,
  callback: D.APIInteractionResponse,
) {
  await rest.post(R.interactionCallback(id, token), { body: callback });
}

function collect<T>(array: T[], toId: (value: T) => string) {
  return new Collection(array.map((t) => [toId(t), t]));
}
