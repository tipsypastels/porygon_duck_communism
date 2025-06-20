import { Command } from "../server/command/mod.ts";

const ping: Command = ({ embed, setEphemeral }) => {
  setEphemeral();
  embed
    // .face("speech.png")
    .thumbnail(
      "https://github.com/tipsypastels/porygon2/blob/master/assets/porygon2_avatar.png?raw=true",
    )
    .color("info")
    .title(":sparkles: Pong! Porygon is online~")
    .description("_beep boop_ How are you today?");
};

ping.register = (cmd) => {
  cmd.description("Pings the bot.");
};

export default ping;
