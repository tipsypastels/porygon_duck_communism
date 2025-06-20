import { join } from "@std/path";

const BASE = "https://porygon.deno.dev/assets";

export function asset(path: string) {
  return join(BASE, path);
}
