import { unwrap } from "$util/assert.ts";
import { assert } from "@std/assert";
import * as Discord from "discord-api-types";

type Type = Discord.ApplicationCommandOptionType;
const Type = Discord.ApplicationCommandOptionType;

type Option = Discord.APIApplicationCommandInteractionDataOption<
  Discord.InteractionType.ApplicationCommand
>;

type Resolved = Discord.APIInteractionDataResolved;

export class CommandOptions {
  #options: Option[];
  #resolved: Resolved;

  constructor(options: Option[], resolved: Resolved) {
    this.#options = options;
    this.#resolved = resolved;
  }

  getSubcommandInfo() {
    const option = this.#findTyped(Type.Subcommand);
    const { name } = option;
    const options = new CommandOptions(option.options ?? [], this.#resolved);
    return { name, options };
  }

  getString(name: string): string {
    return this.#getTyped(name, Type.String).value;
  }

  getOptionalString(name: string): string | undefined {
    return this.#tryGetTyped(name, Type.String)?.value;
  }

  #getTyped<const T extends Type>(name: string, type: T) {
    return this.#cast(name, type, this.#get(name));
  }

  #tryGetTyped<const T extends Type>(name: string, type: T) {
    const option = this.#tryGet(name);
    if (option) return this.#cast(name, type, option);
  }

  #findTyped<const T extends Type>(type: T) {
    return unwrap(
      this.#tryFindTyped(type),
      `Command option with type ${type} not found`,
    );
  }

  #tryFindTyped<const T extends Type>(type: T) {
    const option = this.#options.find((option) => option.type === type);
    if (option) return option as Option & { type: T };
  }

  #cast<const T extends Type>(name: string, type: T, option: Option) {
    assert(
      option.type === type,
      `Command option '${name}' should be type ${type}, got ${option.type}`,
    );
    return option as Option & { type: T };
  }

  #get(name: string) {
    return unwrap(this.#tryGet(name), `Missing command option '${name}'`);
  }

  #tryGet(name: string) {
    return this.#options.find((option) => option.name === name);
  }

  // TODO: Replace with serialize for logging.
  toString() {
    return JSON.stringify(this.#options);
  }
}
