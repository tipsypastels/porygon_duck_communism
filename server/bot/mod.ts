import { unwrap } from "$util/assert.ts";
import { Client, Events, GatewayIntentBits, REST } from "discord.js";
import { addCommands } from "../../commands/mod.ts";
import { runCommand } from "./command/mod.ts";
import { CommandRegistrar } from "./command/registrar.ts";

export class Bot {
  readonly dev: boolean;
  readonly env: BotEnv;
  readonly rest: REST;
  readonly commands: CommandRegistrar;
  readonly client: Client;

  constructor({ dev }: { dev: boolean }) {
    this.dev = dev;
    this.env = makeBotEnv();
    this.rest = new REST().setToken(this.env.token);

    this.commands = new CommandRegistrar(this);
    this.commands.into(addCommands);

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.once(Events.ClientReady, (client) => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        await runCommand(this, interaction);
      }
    });
  }
}

export interface BotEnv {
  token: string;
  botId: string;
  guildId: string;
}

function makeBotEnv(): BotEnv {
  const get = (n: string) => unwrap(Deno.env.get(n), `Missing env var '${n}'`);

  return {
    token: get("DISCORD_BOT_TOKEN"),
    botId: get("DISCORD_BOT_ID"),
    guildId: get("DISCORD_GUILD_ID"),
  };
}
