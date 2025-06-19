import { unwrap } from "$util/unwrap.ts";
import * as Discord from "discord-api-types";

export interface Command {
  (params: CommandParams): Promise<void>;
  register(builder: CommandDataBuilder): void;
}

export interface CommandParams {
}

export class CommandDataBuilder {
  static register(command: Command) {
    const builder = new this(command.name);
    command.register(builder);
    return builder;
  }

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
    return unwrap(f(), `Command '${this.#name}' is missing '${key}'`);
  }
}
