import "../commands/mod.ts";
import { registrar } from "../server/command/registrar.ts";
import { hono } from "../server/mod.ts";

registrar;
Deno.serve(hono.fetch);
