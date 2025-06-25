import { unwrap } from "$util/assert.ts";
import { SlashCommandBuilder } from "@discordjs/builders";
import * as Discord from "discord-api-types";
import {
  postApplicationGuildCommand,
  putApplicationGuildCommands,
} from "../../rest.ts";
import { Manifest } from "./manifest.ts";
import { Command } from "../mod.ts";
import { Collection } from "@discordjs/collection";

export interface CommandCell {
  command: Command;
  data: { id: string; name: string };
}

export class CommandRegistrar {
  #unregistered = new UnregisteredList();
  #registered = new RegisteredList();

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

  register() {
    return this.#register(Manifest.empty(), putApplicationGuildCommands);
  }

  async registerChanges() {
    const manifest = await Manifest.openOrEmpty();
    return await this.#register(
      manifest,
      async (data) =>
        new Collection(
          await Promise.all(data.map(postApplicationGuildCommand)),
        ),
      (data) => manifest.isNewOrHasChanged(data),
    );
  }

  async #register(
    manifest: Manifest,
    submitData: (
      data: Discord.RESTPostAPIApplicationCommandsJSONBody[],
    ) => Promise<Collection<string, Discord.APIApplicationCommand>>,
    filterData?: (
      data: Discord.RESTPostAPIApplicationCommandsJSONBody,
    ) => boolean,
  ) {
    const unregistered = this.#unregistered.take();
    const postData = unregistered.map((command) => {
      const builder = new SlashCommandBuilder();
      command.build(builder);
      return builder.toJSON();
    });

    const uploadPostData = filterData ? postData.filter(filterData) : postData;
    const responseData = uploadPostData.length > 0
      ? await submitData(uploadPostData)
      : [];
    const responseDataByName = new Map(
      responseData.map((d) => [d.name, d]),
    );

    for (let i = 0; i < unregistered.length; i++) {
      // assumes that the output is in order
      const command = unregistered[i];
      const commandPostData = postData[i];

      const { name } = commandPostData;
      const commandResponseData = responseDataByName.get(name);

      const id = unwrap(
        commandResponseData?.id ?? manifest.get(name),
        `Command '${name}' not in response or manifest`,
      );

      const cell: CommandCell = { command, data: { id, name } };

      manifest.set(cell, commandPostData);
      this.#registered.add(cell);

      if (commandResponseData) {
        console.log(`Registered '${name}' command`);
      }
    }

    await manifest.write();
  }

  async hydrate() {
    const manifest: Manifest = await Manifest.open();
    const unregistered = this.#unregistered.take();

    for (const command of unregistered) {
      const builder = new SlashCommandBuilder();
      command.build(builder);

      const { name } = builder;
      const id = unwrap(
        manifest.get(name),
        `Command '${name}' not in manifest`,
      );

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

export const registrar = new CommandRegistrar();
