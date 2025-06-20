import {
  CommandOptionType,
  fromSubcommands,
  Subcommand,
} from "../server/command/mod.ts";

const hello: Subcommand = ({ embed }) => {
  embed.title("hello");
};

hello.regData = {
  name: "hello",
  description: "hello",
};

const goodbye: Subcommand = ({ embed }) => {
  embed.title("goodbye");
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
