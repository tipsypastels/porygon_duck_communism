const BASE = "https://porygon.deno.dev/assets";

export type AssetGroup<N extends string[]> = Record<N[number], string>;

export function assetGroup<const N extends string[]>(dir: string, names: N) {
  const out: Partial<AssetGroup<N>> = {};

  for (const name of names) {
    out[name as N[number]] = asset(`${dir}/${name}`);
  }

  return out as AssetGroup<N>;
}

export function asset(path: string) {
  return `${BASE}/${path}`;
}

export const FACES = assetGroup("faces", [
  "danger.png",
  "error.png",
  "plead.png",
  "smile.png",
  "speech.png",
  "thanos.png",
  "vibe.png",
  "warning.png",
]);
