import { unwrap } from "$util/unwrap.ts";
import { assert } from "@std/assert";
import { DEV } from "./env.ts";

let publicUrl = Deno.env.get("PUBLIC_URL");

assert(DEV || publicUrl, "Missing env var 'PUBLIC_URL'");

if (publicUrl) {
  console.log("Public URL", publicUrl);
}

export function setDevPublicUrl(url: string) {
  if (DEV) {
    publicUrl = url;
  }
}

export function getPublicUrl() {
  return unwrap(publicUrl, "No public URL, is the server running?");
}
