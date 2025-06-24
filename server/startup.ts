import { assert } from "@std/assert";
import { App } from "./mod.ts";

export type StartupTask =
  | ["register"]
  | ["hydrate"]
  | ["login"];

export class StartupTasks {
  #app: App;
  #finished = false;
  #makePromises: (() => Promise<void>)[] = [];

  constructor(app: App) {
    this.#app = app;
  }

  add(...task: StartupTask) {
    const { bot, dev } = this.#app;

    let makePromise: () => Promise<void>;

    switch (task[0]) {
      case "register": {
        makePromise = () => bot.commands.register({ writeManifest: !dev });
        break;
      }
      case "hydrate": {
        makePromise = () => bot.commands.hydrate();
        break;
      }
      case "login": {
        makePromise = async () => {
          await bot.client.login(bot.env.token);
        };
      }
    }

    this.#makePromises.push(makePromise);
  }

  async run() {
    assert(!this.#finished, "Tried to run startup tasks again");
    await Promise.all(this.#makePromises.map((f) => f()));

    this.#makePromises = [];
    this.#finished = true;
  }
}
