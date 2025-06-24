import { Command } from "../server/discord/command/mod.ts";
import { random, randomN, toSentence } from "$util/array.ts";

export const nudge: Command = async ({ embed, getMembers }) => {
  const members = await getMembers();
  const disaster = random(DISASTERS);
  const count = Math.min(random(BASE_COUNT), members.length);
  const victims = randomN(count, members);

  embed
    .setTitle(disaster)
    .setDescription(`${toSentence(victims)} were killed.`)
    .setPoryColor("ok");
};

nudge.build = (cmd) => {
  cmd
    .setName("nudge")
    .setDescription("Never use this it causes natural disasters.");
};

const BASE_COUNT = [3, 4, 5, 6, 7];
const DISASTERS = [
  "Buildings crumble",
  "Earthquakes makin their way downtown ziggin fast",
  "Cookies crumble",
  "Groudon: Emerges",
  "A Porytude 7 earthquake!",
  "Just imagine Discord shaking",
  "Cars tumble down the roads",
  "Earthquakes are uncomf",
  "Hundreds of books drop from the shelves",
  "All the chairs roll away",
  "Vases fall and shatter",
  "A glass of water spills",
  "A plant falls over leaving dirt everywhere",
  "Random ceiling tiles fall down",
  "The floor shakes and cracks",
];
