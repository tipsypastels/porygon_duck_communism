import { usageError } from "../server/command/error.ts";
import { Command } from "../server/command/mod.ts";

const ping: Command = ({ embed, setEphemeral }) => {
  // setEphemeral();
  throw oops();
  // embed
  //   .face("speech.png")
  //   .color("info")
  //   .title(":sparkles: Pong! Porygon is online~")
  //   .description("_beep boop_ How are you today?");
};

ping.register = (cmd) => {
  cmd.description("Pings the bot.");
};

export default ping;

const oops = usageError("oops", (e) => {
  e
    .face("speech.png")
    .color("info")
    .title(":sparkles: Pong! Porygon is online~")
    .description("_beep boop_ How are you today?");
});
