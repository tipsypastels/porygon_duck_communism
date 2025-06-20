import { unwrap } from "$util/unwrap.ts";
import { assert } from "@std/assert";
import * as Discord from "discord-api-types";
import { CommandOptionType } from "./mod.ts";

type Option = Discord.APIApplicationCommandInteractionDataOption<
  Discord.InteractionType.ApplicationCommand
>;
type Resolved = Discord.APIInteractionDataResolved;

export class CommandOptions {
  #options: Option[];
  #resolved: Resolved;

  constructor(options: Option[] = [], resolved: Resolved = {}) {
    this.#options = options;
    this.#resolved = resolved;
  }

  getSubcommandInfo() {
    const option = this.#findTyped(CommandOptionType.Subcommand);
    const { name } = option;
    const options = new CommandOptions(option.options, this.#resolved);
    return { name, options };
  }

  string(name: string): string {
    return this.#getTyped(name, CommandOptionType.String).value;
  }

  tryString(name: string): string | undefined {
    return this.#tryGetTyped(name, CommandOptionType.String)?.value;
  }

  #getTyped<const T extends CommandOptionType>(name: string, type: T) {
    return this.#cast(name, type, this.#get(name));
  }

  #tryGetTyped<const T extends CommandOptionType>(name: string, type: T) {
    const option = this.#get(name);
    if (option) return this.#cast(name, type, option);
  }

  #findTyped<const T extends CommandOptionType>(type: T) {
    return unwrap(
      this.#tryFindTyped(type),
      `Command option with type ${type} not found`,
    );
  }

  #tryFindTyped<const T extends CommandOptionType>(type: T) {
    const option = this.#options.find((option) => option.type === type);
    if (option) return option as Option & { type: T };
  }

  #cast<const T extends CommandOptionType>(
    name: string,
    type: T,
    option: Option,
  ) {
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
