import * as Discord from "discord-api-types";
import { AssetGroupName, FACES } from "../asset.ts";

export type IntoEmbed<P extends unknown[] = []> =
  | IntoEmbedFn<P>
  | IntoEmbedObj<P>;

export interface IntoEmbedFn<P extends unknown[] = []> {
  (embed: Embed, ...params: P): void;
}

export interface IntoEmbedObj<P extends unknown[] = []> {
  intoEmbed: IntoEmbedFn<P>;
}

export class Embed {
  #inner: Discord.APIEmbed = {};
  #touched = false;

  #set<K extends keyof Discord.APIEmbed>(key: K, value: Discord.APIEmbed[K]) {
    this.#inner[key] = value;
    this.#touched = true;
    return this;
  }

  get touched() {
    return this.#touched;
  }

  into<P extends unknown[] = []>(into: IntoEmbed<P>, ...params: P) {
    "intoEmbed" in into
      ? into.intoEmbed(this, ...params)
      : into(this, ...params);
    return this;
  }

  title(title: string) {
    return this.#set("title", title);
  }

  description(description: string) {
    return this.#set("description", description);
  }

  color(color: keyof typeof STANDARD_COLORS | number) {
    return this.#set(
      "color",
      typeof color === "string" ? STANDARD_COLORS[color] : color,
    );
  }

  footer(footer: string) {
    return this.#set("footer", { text: footer });
  }

  face(name: AssetGroupName<typeof FACES>) {
    return this.thumbnail(FACES.get(name).url);
  }

  thumbnail(url: string) {
    return this.#set("thumbnail", { url });
  }

  build() {
    return this.#inner;
  }
}

const STANDARD_COLORS = {
  ok: 0x7fc13a,
  info: 0x00c17d,
  error: 0xff0041,
  danger: 0xff8931,
  warning: 0xfdbe4a,
};
