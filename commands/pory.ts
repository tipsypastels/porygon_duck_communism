import { Command, CommandOptionType } from "../server/command/mod.ts";
import { kv } from "../server/kv.ts";
import { random } from "$util/array.ts";
import { codeBlock } from "$util/string.ts";

export const pory: Command = async ({ embed, options }) => {
  const input = options.tryString("input");
  const output = markov.read();

  embed.face("speech.png").color("info").title("Porygon Talk Show");

  if (input) {
    embed.field("Input", codeBlock(input));
    await markov.write(input);
  }

  embed.field("Output", codeBlock(output));
};

pory.regData = {
  name: "pory",
  description: "Speaks to Porygon.",
  options: [
    {
      name: "input",
      type: CommandOptionType.String,
      description: "The message to feed to Pory for future sentences.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                                   Markov                                   */
/* -------------------------------------------------------------------------- */

const markov = await (async () => {
  const EMPTY_FALLBACK = "hi im pory";
  const KV_KEY: Deno.KvKey = ["porymarkov"];
  const SPEAK_LEN = 50;
  const ORDER = 3;

  const initial = await kv.get<string[]>(KV_KEY);
  const states = initial.value ?? [];
  const beginnings: string[] = [];
  let possibilities: Record<string, string[]> = {};

  train();

  function train() {
    possibilities = {};

    for (let i = 0; i < states.length; i++) {
      beginnings.push(states[i].substring(0, ORDER));

      for (let j = 0; j <= states[i].length - ORDER; j++) {
        const gram = states[i].substring(j, j + ORDER);

        if (!possibilities[gram]) {
          possibilities[gram] = [];
        }

        possibilities[gram].push(states[i].charAt(j + ORDER));
      }
    }
  }

  return {
    read() {
      const beginning = random(beginnings);

      let result = beginning;
      let current = beginning;
      let next = "";

      for (let i = 0; i < SPEAK_LEN - ORDER; i++) {
        next = random(possibilities[current] ?? []);

        if (!next) {
          break;
        }

        result += next;
        current = result.substring(result.length - ORDER, result.length);
      }

      return result ?? EMPTY_FALLBACK;
    },

    async write(state: string) {
      states.push(state);
      train();
      await kv.set(KV_KEY, states);
    },
  };
})();
