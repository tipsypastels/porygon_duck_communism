import { join } from "@std/path";
import { getPublicOrInternalUrl } from "./public.ts";

export type AssetGroupName<AG> = AG extends AssetGroup<infer N> ? N[number]
  : never;

export class AssetGroup<const N extends string[]> {
  #map = new Map<string, Asset>();

  constructor(dir: string, names: N) {
    for (const name of names) {
      this.#map.set(name, new Asset(join(dir, name)));
    }
  }

  get(name: N[number]) {
    return this.#map.get(name)!;
  }
}

export class Asset {
  #path: string;

  constructor(path: string) {
    this.#path = path;
  }

  get url() {
    return join(getPublicOrInternalUrl(), "assets", this.#path);
  }
}

export const FACES = new AssetGroup("faces", [
  "8ball.png",
  "angry.png",
  "danger.png",
  "error.png",
  "plead.png",
  "smile.png",
  "speech.png",
  "thanos.png",
  "vibe.png",
  "warning.png",
]);
