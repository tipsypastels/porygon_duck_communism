import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { Bot } from "./bot/mod.ts";
import { StartupTask, StartupTasks } from "./startup.ts";

export class App {
  readonly dev: boolean;
  readonly bot: Bot;

  #startupTasks = new StartupTasks(this);

  #hono = new Hono()
    .use(serveStatic({ root: "public" }));

  constructor({ dev }: { dev: boolean }) {
    this.dev = dev;
    this.bot = new Bot({ dev });
  }

  addStartupTask(...task: StartupTask) {
    this.#startupTasks.add(...task);
  }

  startup() {
    return this.#startupTasks.run();
  }

  serve() {
    Deno.serve(this.#hono.fetch);
  }
}
