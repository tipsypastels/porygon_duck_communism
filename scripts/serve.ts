import { addAllCommands } from "../commands/mod.ts";
import { registrar } from "../server/command/registrar.ts";
import { DEV } from "../server/env.ts";
import { startQueues } from "../server/kv.ts";
import { hono } from "../server/mod.ts";

addAllCommands();
startQueues();

if (DEV) {
  await registrar.register({ writeManifest: false });
} else {
  await registrar.hydrate();
}

Deno.serve(hono.fetch);
