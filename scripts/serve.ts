import { addAllCommands } from "../commands/mod.ts";
import { registrar } from "../server/command/registrar.ts";
import { DEV } from "../server/env.ts";
import { hono } from "../server/mod.ts";
import { setInternalUrl } from "../server/public.ts";

addAllCommands();

if (DEV) {
  await registrar.register({ writeManifest: false });
} else {
  await registrar.hydrate();
}

Deno.serve({
  onListen(addr) {
    const internalUrl = `http://${addr.hostname}:${addr.port}`;
    setInternalUrl(internalUrl);
    console.log("Listening on", internalUrl);
  },
}, hono.fetch);
