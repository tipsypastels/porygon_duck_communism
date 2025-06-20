import { Command } from "../server/command/mod.ts";

export const ping: Command = ({ embed, setEphemeral }) => {
  setEphemeral();
  embed
    .face("speech.png")
    .color("info")
    .title(":sparkles: Pong! Porygon is online~")
    .description("_beep boop_ How are you today?");
};

ping.regData = {
  name: "ping",
  description: "Pings the bot.",
};
