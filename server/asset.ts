const BASE = "https://porygon.deno.dev/assets";

export function asset(path: string) {
  return `${BASE}/${path}`;
}
