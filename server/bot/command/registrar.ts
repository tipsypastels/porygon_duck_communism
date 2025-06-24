import { unwrap } from "$util/assert.ts";
import { APIApplicationCommand, Routes, SlashCommandBuilder } from "discord.js";
import { Bot } from "../mod.ts";
import { Command } from "./mod.ts";

type Manifest = Record<string, string>;

const MANIFEST_FILE = new URL("../../.commands", import.meta.url).pathname;

export interface CommandCell {
  command: Command;
  data: { id: string; name: string };
}

export class CommandRegistrar {
  #bot: Bot;

  #unregistered = new UnregisteredList();
  #registered = new RegisteredList();

  constructor(bot: Bot) {
    this.#bot = bot;
  }

  getById(id: string) {
    return this.#registered.byId.get(id);
  }

  into(f: (registrar: CommandRegistrar) => void) {
    f(this);
    return this;
  }

  add(command: Command) {
    this.#unregistered.add(command);
    return this;
  }

  async register({ writeManifest }: { writeManifest: boolean }) {
    const manifest: Manifest = {};
    const unregistered = this.#unregistered.take();
    const { rest, env } = this.#bot;

    const postData = unregistered.map((command) => {
      const builder = new SlashCommandBuilder();
      command.build(builder);
      return builder.toJSON();
    });

    const responseData = await rest.put(
      Routes.applicationGuildCommands(env.botId, env.guildId),
      { body: postData },
    ) as APIApplicationCommand[];

    for (let i = 0; i < responseData.length; i++) {
      // assumes that the output is in order
      const command = unregistered[i];
      const commandResponseData = responseData[i];
      const cell: CommandCell = { command, data: commandResponseData };

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
      const builder = new SlashCommandBuilder();
      command.build(builder);

      const { name } = builder;
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
  byId = new Map<string, CommandCell>();
  byName = new Map<string, CommandCell>();
  byCommand = new Map<Command, CommandCell>();

  add(cell: CommandCell) {
    this.byId.set(cell.data.id, cell);
    this.byName.set(cell.data.name, cell);
    this.byCommand.set(cell.command, cell);
  }
}
