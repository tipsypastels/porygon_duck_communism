import { usageError } from "../server/command/error.ts";
import { Command, CommandOptionType } from "../server/command/mod.ts";
import { codeBlock, ellipsis } from "$util/string.ts";
import { all, create } from "mathjs";

export const calc: Command = async ({ embed, options }) => {
  const equation = options.string("equation");
  const equationTrunc = codeBlock(ellipsis(equation, 100));

  embed.field("Equation", equationTrunc);

  try {
    const result = await evaluate(equation);

    embed
      .color("info")
      .title("Aaand the answer is...")
      .field("Result", codeBlock(result));
  } catch (error) {
    if (error instanceof Disabled) {
      throw disabledError(error);
    } else if (error instanceof Error) {
      throw parseError(error.message);
    } else {
      throw error;
    }
  }
};

calc.regData = {
  name: "calc",
  description: "Does your math homework.",
  options: [
    {
      name: "equation",
      type: CommandOptionType.String,
      required: true,
      description: "An equation to evaluate.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                                   Errors                                   */
/* -------------------------------------------------------------------------- */

class Disabled {
  constructor(readonly name: string) {}
}

const parseError = usageError("parseError", (embed, message: string) => {
  embed
    .error("warning")
    .title(
      "_Porygon adjusts her glasses and takes another look at that equation._",
    )
    .description(codeBlock(message));
});

const disabledError = usageError(
  "disabledError",
  (embed, { name }: Disabled) => {
    embed
      .error("danger")
      .title(`Unsafe function '${name}' may not be used!`)
      .description("I see you there. Trying to break things.");
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Mathjs                                   */
/* -------------------------------------------------------------------------- */

const math = create(all);
const evaluate = math.evaluate.bind(math);

function makeDisabled(name: string) {
  return () => {
    throw new Disabled(name);
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
