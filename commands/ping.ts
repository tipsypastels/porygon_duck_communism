import { Command } from "../server/command/mod.ts";

const ping: Command = ({ embed }) => {
  const { duration } = performance.measure(
    "interactionReceived",
    "runningCommand",
  );
  console.log(duration);
  embed.title("Pong!");
};

ping.register = (cmd) => {
  cmd.description("Pings the bot.");
};

export default ping;
