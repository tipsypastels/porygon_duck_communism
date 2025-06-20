import {
  CommandOptionType,
  fromSubcommands,
  Subcommand,
} from "../server/command/mod.ts";

const hello: Subcommand = ({ embed, options }) => {
  embed.title("hello").description(options.toString());
};

hello.regData = {
  name: "hello",
  description: "hello",
};

const goodbye: Subcommand = ({ embed, options }) => {
  embed.title("goodbye").description(options.toString());
};

goodbye.regData = {
  name: "goodbye",
  description: "goodbye",
  options: [
    {
      name: "foo",
      description: "foo",
      type: CommandOptionType.String,
    },
  ],
};

export default fromSubcommands({ hello, goodbye }, {
  name: "world",
  description: "Says hello or goodbye.",
});
