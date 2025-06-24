import { Command } from "../server/bot/command/mod.ts";

export const ping: Command = ({ embed, setEphemeral }) => {
  setEphemeral();

  embed
    .setTitle(":sparkles: Pong! Porygon is online~")
    .setDescription("_beep boop_ How are you today?")
    .setPoryFace("speech.png")
    .setPoryColor("info");
};

ping.build = (b) => {
  b.setName("ping").setDescription("Pings the bot.");
};
