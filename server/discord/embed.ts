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
    this.#set("title", title);
    return this;
  }

  description(description: string) {
    this.#set("description", description);
    return this;
  }

  footer(footer: string) {
    this.#set("footer", { text: footer });
  }

  face(name: AssetGroupName<typeof FACES>) {
    this.#set("thumbnail", { url: FACES.get(name).url });
  }

  build() {
    return this.#inner;
  }
}
