import * as Discord from "discord-api-types";
import { registrar } from "./registrar.ts";
import { httpAssert, httpUnwrap } from "$util/unwrap.ts";
import { CommandParams } from "./mod.ts";
import { Embed } from "../discord/embed.ts";
import { UsageError } from "./error.ts";
import { CommandOptions } from "./options.ts";

// TODO: once deploy supports otel refactor this and also add a ping to /ping
export async function runCommand(
  interaction: Discord.APIApplicationCommandInteraction,
): Promise<Discord.APIInteractionResponse> {
  httpAssert(
    interaction.data.type === Discord.ApplicationCommandType.ChatInput,
    { code: 400, message: "unsupported command type" },
  );

  const command = httpUnwrap(registrar.getById(interaction.data.id), {
    code: 404,
    message: "command not found",
  });

  const member = httpUnwrap(interaction.member, {
    code: 400,
    message: "no member in payload",
  });

  let flags = 0 as Discord.MessageFlags;

  const embed = new Embed();
  const options = new CommandOptions(
    interaction.data.options,
    interaction.data.resolved,
  );

  const setEphemeral = () => flags |= Discord.MessageFlags.Ephemeral;
  const params: CommandParams = { embed, options, member, setEphemeral };

  const commandName = interaction.data.name;

  let data: Discord.APIInteractionResponseCallbackData;

  try {
    await command(params);

    console.log(
      `Command '${commandName}' used by ${member.user.username}`,
    );

    data = { flags, embeds: [embed.build()] };
  } catch (error) {
    if (error instanceof UsageError) {
      console.warn(
        `command '${commandName}' got error ${error.code} when used by ${member.user.username}`,
      );

      const flags = error.ephemeral
        ? Discord.MessageFlags.Ephemeral
        : undefined;
      const embed = new Embed();
      embed.into(error, commandName);

      data = {
        flags,
        embeds: [embed.build()],
      };
    } else {
      console.error(
        `command '${commandName}' crashed when used by ${member.user.username}`,
        error,
      );

      data = {
        // TODO
        content: "CRASH",
      };
    }
  }

  return {
    type: Discord.InteractionResponseType.ChannelMessageWithSource,
    data,
  };
}
