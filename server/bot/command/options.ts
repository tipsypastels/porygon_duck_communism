import { ChatInputCommandInteraction } from "discord.js";

type Inner = ChatInputCommandInteraction["options"];

export class CommandOptions {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  getString(name: string) {
    return this.#inner.getString(name, true);
  }

  getOptionalString(name: string) {
    return this.#inner.getString(name) ?? undefined;
  }
}
