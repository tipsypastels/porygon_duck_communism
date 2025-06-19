import { addAllCommands } from "../commands/mod.ts";
import { registrar } from "../server/command/registrar.ts";
import { DEV } from "../server/env.ts";
import { hono } from "../server/mod.ts";
import { setDevPublicUrl } from "../server/public.ts";

addAllCommands();

if (DEV) {
  await registrar.register({ writeManifest: false });
} else {
  await registrar.hydrate();
}

Deno.serve({
  onListen(addr) {
    const url = `http://${addr.hostname}:${addr.port}`;
    setDevPublicUrl(url);
    console.log("Listening on", url);
  },
}, hono.fetch);
