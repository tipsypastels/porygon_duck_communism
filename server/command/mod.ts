import * as Discord from "discord-api-types";
import { Embed } from "../discord/embed.ts";
import { CommandOptions } from "./options.ts";

export type CommandFn = (params: CommandParams) => void | Promise<void>;
export type CommandRegData =
  Discord.RESTPostAPIChatInputApplicationCommandsJSONBody;
export type SubcommandRegData = Omit<
  Discord.APIApplicationCommandSubcommandOption,
  "type"
>;

export type CommandOptionType = Discord.ApplicationCommandOptionType;
export const CommandOptionType = Discord.ApplicationCommandOptionType;

export interface Command extends CommandFn {
  regData: CommandRegData;
}

export interface Subcommand extends CommandFn {
  regData: SubcommandRegData;
}

export interface CommandParams {
  embed: Embed;
  options: CommandOptions;
  member: Discord.APIGuildMember;
  setEphemeral(): void;
}

export function fromSubcommands(
  subcommands: Record<string, Subcommand>,
  regData: Omit<CommandRegData, "options">,
) {
  const command: Command = ({ options, ...otherParams }) => {
    const subcommandInfo = options.getSubcommandInfo();
    const subcommand = subcommands[subcommandInfo.name];

    return subcommand({
      options: subcommandInfo.options,
      ...otherParams,
    });
  };

  command.regData = {
    ...regData,
    options: Object.values(subcommands).map((subcommand) => ({
      type: CommandOptionType.Subcommand,
      ...subcommand.regData,
    })),
  };

  return command;
}
