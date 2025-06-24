import * as Discord from "discord-api-types";
import sha1 from "sha1";
import { CommandCell } from "./mod.ts";

const PATH = new URL("../../../../.commands", import.meta.url).pathname;

interface Entry {
  id: string;
  hash: string;
}

export class Manifest {
  static async open() {
    const text = await Deno.readTextFile(PATH);
    return new this(JSON.parse(text));
  }

  static empty() {
    return new this({});
  }

  static async openOrEmpty() {
    try {
      return await this.open();
    } catch {
      return new this({});
    }
  }

  #data: Record<string, Entry>;
  #changed = false;

  private constructor(data: Record<string, Entry>) {
    this.#data = data;
  }

  isNewOrHasChanged(data: Discord.RESTPostAPIApplicationCommandsJSONBody) {
    if (!(data.name in this.#data)) {
      console.debug(`Command '${data.name}' is new`);
      return true;
    }

    const hash = sha1(JSON.stringify(data));
    if (hash !== this.#data[data.name].hash) {
      console.debug(`Command '${data.name}' has changed`);
      return true;
    }

    console.debug(`Command '${data.name}' is old`);
    return false;
  }

  get(name: string): string | undefined {
    return this.#data[name]?.id;
  }

  set(
    cell: CommandCell,
    regData: Discord.RESTPostAPIApplicationCommandsJSONBody,
  ) {
    const { id, name } = cell.data;
    const hash = sha1(JSON.stringify(regData));
    if (this.#data[name]?.hash === hash) {
      return;
    }

    this.#data[name] = { id, hash };
    this.#changed = true;
  }

  write() {
    if (!this.#changed) return;
    return Deno.writeTextFile(PATH, JSON.stringify(this.#data));
  }
}
