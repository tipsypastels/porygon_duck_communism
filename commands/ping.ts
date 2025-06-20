import { asset } from "../server/asset.ts";
import { Command } from "../server/command/mod.ts";

const ping: Command = ({ embed, setEphemeral }) => {
  setEphemeral();
  embed
    .thumbnail(asset("faces/speech.png"))
    .color("info")
    .title(":sparkles: Pong! Porygon is online~")
    .description("_beep boop_ How are you today?");
};

ping.register = (cmd) => {
  cmd.description("Pings the bot.");
};

export default ping;
