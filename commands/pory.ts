import { random } from "$util/array.ts";
import { codeBlock } from "$util/string.ts";
import { Command } from "../server/discord/command/mod.ts";
import { kv } from "../server/kv.ts";
import { createQueue } from "../server/queue.ts";

export const pory: Command = async ({ embed, options }) => {
  const input = options.getOptionalString("input");
  const output = markov.read();

  embed
    .setTitle("Porygon Talk Show")
    .setPoryFace("speech.png")
    .setPoryColor(input ? "ok" : "info");

  if (input) {
    embed.addField("Input", codeBlock(input));
    await markov.enqueue(input);
  }

  embed.addField("Output", codeBlock(output));
};

pory.build = (cmd) => {
  cmd
    .setName("pory")
    .setDescription("Speaks to Porygon.")
    .addStringOption((opt) =>
      opt
        .setName("input")
        .setDescription("The message to feed to Pory for future sentences.")
    );
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

    enqueue: createQueue("porymarkov", async (state: string) => {
      states.push(state);
      train();
      await kv.set(KV_KEY, states);
    }),
  };
})();
