import { unwrap } from "$util/assert.ts";
import { Awaitable } from "$util/types.ts";
import { assert } from "@std/assert";
import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { EmbedBuilderV2 } from "../embed.ts";
import { Bot } from "../mod.ts";
import { UsageError } from "./error.ts";
import { CommandOptions } from "./options.ts";

export type CommandFn = (params: CommandParams) => Awaitable<void>;

export interface Command extends CommandFn {
  build(builder: SlashCommandBuilder): void;
}

export interface Subcommand extends CommandFn {
  build(builder: SlashCommandSubcommandBuilder): void;
}

export interface CommandParams {
  bot: Bot;
  embed: EmbedBuilderV2;
  guild: Guild;
  member: GuildMember;
  options: CommandOptions;
  interaction: ChatInputCommandInteraction;
  setEphemeral(ephemeral?: boolean): void;
}

export async function runCommand(
  bot: Bot,
  interaction: ChatInputCommandInteraction,
) {
  const cell = bot.commands.getById(interaction.commandId);
  if (!cell) {
    return void console.warn(
      `Unknown interaction command '${interaction.commandName}'`,
    );
  }

  const embed = new EmbedBuilderV2();
  const guild = unwrap(interaction.guild, "Expected guild");
  const member = unwrap(interaction.member, "Expected member");
  const options = new CommandOptions(interaction.options);

  let ephemeral = false;

  const setEphemeral = (e = true) => {
    ephemeral = e;
  };

  assert(member instanceof GuildMember, "Expected full member");

  const params: CommandParams = {
    bot,
    embed,
    guild,
    member,
    options,
    interaction,
    setEphemeral,
  };

  // TODO: Reply helper class for handling this and
  // allowing early responses.
  let reply: InteractionReplyOptions;

  try {
    await cell.command(params);

    console.log(`Command '${cell.data.name}' used by ${member.displayName}`);

    reply = {
      embeds: [embed],
      flags: ephemeral ? MessageFlags.Ephemeral : undefined,
    };
  } catch (error) {
    if (error instanceof UsageError) {
      console.warn(
        `Command '${cell.data.name}' got error ${error.code} when used by ${member.displayName}`,
      );

      const embed = EmbedBuilderV2.into(error, cell.data.name);
      const { ephemeral } = error;

      reply = {
        embeds: [embed],
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      };
    } else {
      console.error(
        `Command '${cell.data.name}' crashed when used by ${member.displayName}`,
        error,
      );

      // TODO
      reply = {
        content: "CRASH",
      };
    }
  }

  await interaction.reply(reply);
}
