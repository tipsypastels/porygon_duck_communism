import { registrar } from "../server/command/registrar.ts";
import { hono } from "../server/mod.ts";

console.log(registrar);
Deno.serve(hono.fetch);
