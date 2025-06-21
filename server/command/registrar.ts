import { unwrap } from "$util/unwrap.ts";
import { putApplicationGuildCommands } from "../discord/rest.ts";
import { Command, CommandRegData } from "./mod.ts";

type Manifest = Record<string, string>;

const MANIFEST_FILE = new URL("../../.commands", import.meta.url).pathname;

class Registrar {
  #unregistered = new UnregisteredList();
  #registered = new RegisteredList();

  getById(id: string) {
    return this.#registered.byId.get(id)?.command;
  }

  add(command: Command) {
    this.#unregistered.add(command);
    return this;
  }

  async register({ writeManifest }: { writeManifest: boolean }) {
    const regData: CommandRegData[] = [];
    const unregistered = this.#unregistered.take();

    for (const command of unregistered) {
      regData.push(command.regData);
    }

    const responseData = await putApplicationGuildCommands(regData);
    const manifest: Manifest = {};

    for (let i = 0; i < responseData.length; i++) {
      // assumes that the output is in order
      const command = unregistered[i];
      const commandResponseData = responseData[i];
      const cell: Cell = { command, data: commandResponseData };

      manifest[cell.data.name] = cell.data.id;
      this.#registered.add(cell);

      console.log(`Registered '${cell.data.name}' command`);
    }

    if (writeManifest) {
      await Deno.writeTextFile(MANIFEST_FILE, JSON.stringify(manifest));
    }
  }

  async hydrate() {
    const manifestRaw = await Deno.readTextFile(MANIFEST_FILE);
    const manifest: Manifest = JSON.parse(manifestRaw);
    const unregistered = this.#unregistered.take();

    for (const command of unregistered) {
      const { name } = command.regData;
      const id = unwrap(manifest[name], `Command '${name}' not in manifest`);

      this.#registered.add({ command, data: { id, name } });

      console.log(`Hydrated '${name}' command`);
    }
  }
}

class UnregisteredList {
  #list: Command[] = [];

  add(command: Command) {
    this.#list.push(command);
  }

  take() {
    const out = this.#list;
    this.#list = [];
    return out;
  }
}

class RegisteredList {
  byId = new Map<string, Cell>();
  byName = new Map<string, Cell>();
  byCommand = new Map<Command, Cell>();

  add(cell: Cell) {
    this.byId.set(cell.data.id, cell);
    this.byName.set(cell.data.name, cell);
    this.byCommand.set(cell.command, cell);
  }
}

interface Cell {
  command: Command;
  data: { id: string; name: string };
}

export const registrar = new Registrar();
