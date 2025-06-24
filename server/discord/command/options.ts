import { unwrap } from "$util/assert.ts";
import { assert } from "@std/assert";
import * as Discord from "discord-api-types";
import { GuildMember } from "../member.ts";
import { User } from "../user.ts";

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

  // TODO: These can also technically be passed as mentionables, allow support for both if needed.
  getUser(name: string): User {
    return this.#getUser(this.#getTyped(name, Type.User).value);
  }

  getOptionalUser(name: string): User | undefined {
    const id = this.#tryGetTyped(name, Type.User)?.value;
    if (id) return this.#getUser(id);
  }

  getMember(name: string): GuildMember {
    return this.#getMember(this.#getTyped(name, Type.User).value);
  }

  getOptionalMember(name: string): GuildMember | undefined {
    const id = this.#tryGetTyped(name, Type.User)?.value;
    if (id) return this.#getMember(id);
  }

  #getUser(id: string) {
    return new User(this.#getResolved(id, "users"));
  }

  #getMember(id: string) {
    const user = this.#getResolved(id, "users");
    const data = this.#getResolved(id, "members");
    return new GuildMember({ ...data, user });
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

  #getResolved<K extends keyof Resolved>(id: string, key: K) {
    return unwrap(
      this.#resolved[key]?.[id],
      `Missing resolved ${key}['${id}']`,
    ) as NonNullable<Resolved[K]>[string];
  }

  // TODO: Replace with serialize for logging.
  toString() {
    return JSON.stringify(this.#options);
  }
}
