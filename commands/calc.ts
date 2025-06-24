import { codeBlock, ellipsis } from "$util/string.ts";
import { all, create } from "mathjs";
import { usageError } from "../server/discord/command/error.ts";
import { Command } from "../server/discord/command/mod.ts";

export const calc: Command = async ({ embed, options }) => {
  const equation = options.getString("equation");
  const equationTrunc = codeBlock(ellipsis(equation, 100));

  embed.addField("Equation", equationTrunc);

  try {
    const result = await evaluate(equation);

    embed
      .setTitle("Aaand the answer is...")
      .setPoryColor("ok")
      .addField("Result", codeBlock(result));
  } catch (error) {
    if (error instanceof Error) {
      throw parseError(error.message);
    } else {
      throw error;
    }
  }
};

calc.build = (cmd) => {
  cmd
    .setName("calc")
    .setDescription("Does your math homework.")
    .addStringOption((opt) =>
      opt
        .setName("equation")
        .setDescription("An equation to evaluate.")
        .setRequired(true)
    );
};

/* -------------------------------------------------------------------------- */
/*                                   Errors                                   */
/* -------------------------------------------------------------------------- */

const parseError = usageError("parseError", (embed, message: string) => {
  embed
    .setTitle(
      "_Porygon adjusts her glasses and takes another look at that equation._",
    )
    .setDescription(codeBlock(message))
    .setPoryError("warning");
});

const disabledError = usageError(
  "disabledError",
  (embed, name: string) => {
    embed
      .setTitle(`Unsafe function '${name}' may not be used!`)
      .setDescription("I see you there. Trying to break things.")
      .setPoryError("danger");
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Mathjs                                   */
/* -------------------------------------------------------------------------- */

const math = create(all);
const evaluate = math.evaluate.bind(math);

function makeDisabled(name: string) {
  return () => {
    throw disabledError(name);
  };
}

const UNSAFE_FNS = [
  "import",
  "createUnit",
  "reviver",
  "evaluate",
  "parse",
  "simplify",
  "derivative",
  "resolve",
];

math.import(
  Object.fromEntries(UNSAFE_FNS.map((f) => [f, makeDisabled(f)])),
  { override: true },
);
