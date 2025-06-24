import { Command } from "../server/discord/command/mod.ts";
import { random } from "$util/array.ts";

export const hug: Command = ({ embed, options, author }) => {
  const friend = options.getMember("friend");
  const isMe = friend.id === author.id;
  const subjectLine = isMe ? "themself" : friend.displayName;
  const stat = random(STATS);

  embed
    .setTitle(`${author.displayName} hugs ${subjectLine}`)
    .setDescription(`:hugging: ${friend.displayName}'s ${stat} rose!`)
    .setPoryFace("smile.png")
    .setPoryColor("ok");
};

hug.build = (cmd) => {
  cmd
    .setName("hug")
    .setDescription("Gives a hug to a friend.")
    .addUserOption((opt) =>
      opt
        .setName("friend")
        .setDescription("The friend to hug.")
        .setRequired(true)
    );
};

const STATS = [
  "Attack",
  "Defense",
  "Speed",
  "Special Attack",
  "Special Defense",
  "HP",
];
