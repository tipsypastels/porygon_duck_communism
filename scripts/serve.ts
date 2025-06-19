import { addAllCommands } from "../commands/mod.ts";
import {
  readPremadeCommandRegister,
  registerCommands,
} from "../server/command/registrar.ts";
import { DEV } from "../server/env.ts";
import { hono } from "../server/mod.ts";

addAllCommands();

if (DEV) {
  await registerCommands();
} else {
  await readPremadeCommandRegister();
}

Deno.serve(hono.fetch);
