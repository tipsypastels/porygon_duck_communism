import { httpUnwrap } from "$util/assert.ts";
import { getErrorMessage } from "$util/error.ts";
import { codeBlock } from "$util/string.ts";
import { Awaitable } from "$util/types.ts";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import * as Discord from "discord-api-types";
import { EmbedBuilderV2 } from "../embed.ts";
import { UsageError } from "./error.ts";
import { CommandOptions } from "./options.ts";
import { registrar } from "./registrar.ts";

export type CommandFn = (params: CommandParams) => Awaitable<void>;

export interface Command extends CommandFn {
  build(builder: SlashCommandBuilder): void;
}

export interface Subcommand extends CommandFn {
  build(builder: SlashCommandSubcommandBuilder): void;
}

export interface CommandParams {
  embed: EmbedBuilderV2;
  options: CommandOptions;
  interaction: Discord.APIChatInputApplicationCommandInteraction;
  setEphemeral(ephemeral?: boolean): void;
}

export async function runCommand(
  interaction: Discord.APIChatInputApplicationCommandInteraction,
): Promise<Discord.APIInteractionResponse> {
  const cell = httpUnwrap(registrar.getById(interaction.data.id), {
    code: 404,
    message: "command not found",
  });

  const member = httpUnwrap(interaction.member, {
    code: 400,
    message: "no member in payload",
  });

  const embed = new EmbedBuilderV2();
  const options = new CommandOptions(
    interaction.data.options ?? [],
    interaction.data.resolved ?? {},
  );

  let ephemeral = false;

  const setEphemeral = (e = true) => {
    ephemeral = e;
  };

  const params: CommandParams = {
    embed,
    options,
    interaction,
    setEphemeral,
  };

  let data: Discord.APIInteractionResponseCallbackData;

  try {
    await cell.command(params);

    console.log(`Command '${cell.data.name}' used by ${member.user.username}`);

    data = {
      embeds: [embed.toJSON()],
      flags: ephemeral ? Discord.MessageFlags.Ephemeral : undefined,
    };
  } catch (error) {
    if (error instanceof UsageError) {
      console.warn(
        `Command '${cell.data.name}' got error ${error.code} when used by ${member.user.username}`,
      );

      const embed = EmbedBuilderV2.into(error, cell.data.name);
      const { ephemeral } = error;

      data = {
        embeds: [embed.toJSON()],
        flags: ephemeral ? Discord.MessageFlags.Ephemeral : undefined,
      };
    } else {
      console.error(
        `Command '${cell.data.name}' crashed when used by ${member.user.username}`,
        error,
      );

      const embed = new EmbedBuilderV2()
        .setTitle("Error! Porygon crashed.")
        .setDescription(
          `An error was thrown while executing the \`${cell.data.name}\` command.`,
        )
        .setPoryError("error");

      const errorMessage = getErrorMessage(error);
      if (errorMessage) embed.addField("Error", codeBlock(errorMessage));

      data = {
        embeds: [embed.toJSON()],
      };
    }
  }

  return {
    data,
    type: Discord.InteractionResponseType.ChannelMessageWithSource,
  };
}
