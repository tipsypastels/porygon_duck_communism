import { hono } from "../server/mod.ts";

Deno.serve(hono.fetch);
