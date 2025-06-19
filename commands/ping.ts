import { Command } from "../server/command/mod.ts";

const ping: Command = async ({ embed }) => {
  embed.title("Pong!");
};

ping.register = (cmd) => {
  cmd.description("Pings the bot.");
};

export default ping;
