import { assert } from "@std/assert";
import { PUBLIC_URL } from "./env.ts";

let internalUrl: string | undefined;

export function setInternalUrl(url: string) {
  internalUrl = url;
}

export function getPublicOrInternalUrl() {
  const url = PUBLIC_URL || internalUrl;
  assert(url, `No public or internal URL, is the server running?`);
  return url;
}
