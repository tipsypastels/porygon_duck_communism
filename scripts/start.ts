import { addCommands } from "../commands/mod.ts";
import { registrar } from "../server/discord/command/registrar.ts";
import { hono } from "../server/mod.ts";
import { startQueues } from "../server/queue.ts";

addCommands();
startQueues();

await registrar.hydrate();

Deno.serve(hono.fetch);
