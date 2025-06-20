import * as Discord from "discord-api-types";
import { Embed } from "../discord/embed.ts";

export type CommandFn = (params: CommandParams) => void | Promise<void>;
export type CommandRegData = Discord.RESTPostAPIApplicationCommandsJSONBody;

export interface Command {
  (params: CommandParams): void | Promise<void>;
  regData: CommandRegData;
}

export interface CommandParams {
  embed: Embed;
  member: Discord.APIGuildMember;
  setEphemeral(): void;
}
