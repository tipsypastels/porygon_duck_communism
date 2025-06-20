import { join } from "@std/path";

// TODO: I'd like to serve from Deploy instead but for some reason that causes Discord to claim it's timing out
// even when the interaction response is instant. My guess is that it sees that the images are being served
// from the same domain as the interaction endpoint and tries to block on loading them instead of doing it
// lazily, and Deploy isn't the fastest at serving static assets.
const BASE_URL =
  "https://raw.githubusercontent.com/tipsypastels/porygon_duck_communism/refs/heads/main/assets";

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
    return join(BASE_URL, this.#path);
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
