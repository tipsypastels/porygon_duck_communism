import * as Discord from "discord-api-types";
import { assert } from "@std/assert";

export interface Command {
  (params: CommandParams): Promise<void>;
  register(builder: CommandDataBuilder): void;
}

export interface CommandParams {
}

export class CommandDataBuilder {
  #name: string;
  #description?: string;

  constructor(nameFromCommandFn: string) {
    this.#name = nameFromCommandFn;
  }

  name(name: string) {
    this.#name = name;
    return this;
  }

  description(description: string) {
    this.#description = description;
    return this;
  }

  build(): Discord.RESTPostAPIApplicationCommandsJSONBody {
    return {
      type: Discord.ApplicationCommandType.ChatInput,
      name: this.#name,
      description: this.#required(() => this.#description, "description"),
    };
  }

  getName() {
    return this.#name;
  }

  #required<T>(f: () => T | undefined, key: string): T {
    const value = f();
    assert(value, `Command ${this.#name} is missing ${key}`);
    return value;
  }
}

export interface CommandCell {
  command: Command;
  data: { id: string; name: string };
}
