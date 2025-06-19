import { Command } from "../server/command/mod.ts";

const ping: Command = async () => {
};

ping.register = (cmd) => {
  cmd.description("Pings the bot.");
};

export default ping;
