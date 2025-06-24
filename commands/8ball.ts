import { random } from "$util/array.ts";
import { ellipsis } from "$util/string.ts";
import { Command } from "../server/discord/command/mod.ts";

export const eightBall: Command = ({ embed, options }) => {
  const question = options.getString("question");
  const questionTrunc = ellipsis(question, QUESTION_MAX_LEN);
  const answer = random(ANSWERS);

  embed
    .setTitle("The wise oracle Porygon studies her magic 8-ball.")
    .setPoryFace("8ball.png")
    .setPoryColor("info")
    .addField("Question", questionTrunc)
    .addField("Answer", answer);
};

eightBall.build = (cmd) => {
  cmd
    .setName("8ball")
    .setDescription("Asks a question of the wise oracle Porygon.")
    .addStringOption((opt) =>
      opt
        .setName("question")
        .setDescription("The question you would ask the wise oracle Porygon.")
        .setRequired(true)
    );
};

const QUESTION_MAX_LEN = 300;
const ANSWERS = [
  "As I see it, yes.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "It is certain.",
  "It is decidedly so.",
  "Most likely.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Outlook good.",
  "Reply hazy, try again.",
  "Signs point to yes.",
  "Very doubtful.",
  "Without a doubt.",
  "Yes.",
  "Yes - definitely.",
  "You may rely on it.",
];
