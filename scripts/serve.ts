import { addAllCommands } from "../commands/mod.ts";
import {
  hydrateCommands,
  registerCommands,
} from "../server/command/registrar.ts";
import { DEV } from "../server/env.ts";
import { hono } from "../server/mod.ts";

addAllCommands();

if (DEV) {
  await registerCommands();
} else {
  await hydrateCommands();
}

Deno.serve(hono.fetch);
