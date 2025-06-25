import { Command } from "../server/discord/command/mod.ts";
import { random } from "$util/array.ts";

export const vibe: Command = ({ embed, author }) => {
  const negative = random(NEGATIVE);
  const positive = random(POSITIVE);

  embed
    .setTitle(`${author.displayName}'s vibe`)
    .setDescription(
      `${author.displayName} is **${negative}** but makes up for it by **${positive}**`,
    )
    .setAuthorName("✨ 𝓋𝒾𝒷𝑒 𝒸𝒽𝑒𝒸𝓀 ✨")
    .setPoryFace("vibe.png")
    .setPoryColor("info");
};

vibe.build = (cmd) => {
  cmd
    .setName("vibe")
    .setDescription("Scientifically analyzes your vibes.");
};

const NEGATIVE = [
  "straight",
  "ugly",
  "problematic",
  "a cursed user",
  "from texas",
  "from england",
  "from australia",
  "into feet",
  "too gay to function",
  "addicted to pleads",
  "a nerd",
  "a slut",
  "a clown",
  "a weeb",
  "a boomer",
  "a homestuck",
  "a gremlin",
  "a gamer",
  "a memer",
  "an owen",
  "an edgelord",
  "a wallflower",
  "a backstabber",
  "a hikikomori",
  "an SAO stan",
  "a Mineta stan",
  "a PC boomer",
  "uncomf",
  "feral",
  "lewd",
  "insecure af",
  "a member of gumbo gang",
  "high on potenuse",
  "mewthree w/ armor",
  "quite conservative",
  "quite problematic",
  "mean to porygon",
  "long overdue for cancellation",
  "on their ninth day without sleep",
  "drowning in Crasher Wake's pool",
  "someone who thinks Terraria is better than Minecraft >:(",
  "a player of the expanded free trial of our critically acclaimed MMORPG #FFXIV? you can play through the entirety of a realm reborn and the award-winning heavensward expansion up to level 60 for FREE with no restrictions on playtime",
];

const POSITIVE = [
  "being gay",
  "being stannable",
  "being the big gay",
  "being a hottie",
  "being a slut for heapdats",
  "being friends with everyone",
  "being sent to horny jail",
  "not being british",
  "using /vibe",
  "getting shoved in a locker",
  "being illegally cute",
  "being too cute for #burd-selfies",
  "observing Inky Appreciation Hour",
  "joining the Warrior Cats Club",
  "looking straight at Endermen",
  "being numerous bees",
  "vaping florida to create a hurricane",
  "being the world's biggest yorkshire pudding",
  "having a severe caffeine addiction",
  "feeding the ducks",
  "being comf",
  "vibing",
  "being Doctor Lala's assistant",
  "stanning Dakota",
  // 'stanning Angie',
  "stanning Inky",
  "stanning Haley",
  "stanning Chura",
  "stanning Pig",
  "stanning Wobb",
  "stanning Soapy",
  // 'stanning Mag',
  // 'stanning Mylah',
];
