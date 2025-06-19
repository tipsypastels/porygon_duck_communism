import { assert } from "@std/assert";

export const DEV = Deno.env.get("DEV") == "1";

export const GUILD_ID = required("DISCORD_GUILD_ID");
export const PUBLIC_KEY = required("DISCORD_PUBLIC_KEY");

function required(name: string) {
  const value = Deno.env.get(name);
  console.log(value);
  assert(value, `Missing env var '${name}'`);
  return value;
}
