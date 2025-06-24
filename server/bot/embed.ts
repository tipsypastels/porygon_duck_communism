import { EmbedBuilder } from "discord.js";
import { FACES } from "../asset.ts";

export type IntoEmbed<P extends unknown[] = []> =
  | IntoEmbedFn<P>
  | IntoEmbedObj<P>;

export interface IntoEmbedFn<P extends unknown[] = []> {
  (embed: EmbedBuilderV2, ...params: P): void;
}

export interface IntoEmbedObj<P extends unknown[] = []> {
  intoEmbed: IntoEmbedFn<P>;
}

export class EmbedBuilderV2 extends EmbedBuilder {
  static into<P extends unknown[] = []>(into: IntoEmbed<P>, ...params: P) {
    return new this().into(into, ...params);
  }

  into<P extends unknown[] = []>(into: IntoEmbed<P>, ...params: P) {
    "intoEmbed" in into
      ? into.intoEmbed(this, ...params)
      : into(this, ...params);
    return this;
  }

  addField(name: string, value: string) {
    return this.addFields({ name, value });
  }

  addInlineField(name: string, value: string) {
    return this.addFields({ name, value, inline: true });
  }

  setPoryColor(name: keyof typeof PORY_COLORS) {
    return this.setColor(PORY_COLORS[name]);
  }

  setPoryFace(name: keyof typeof FACES) {
    return this.setThumbnail(FACES[name]);
  }

  setPoryError(
    name:
      & keyof typeof PORY_COLORS
      & keyof {
        [K in keyof typeof FACES extends `${infer N}.png` ? N : never]: never;
      },
  ) {
    return this.setPoryColor(name).setPoryFace(`${name}.png`);
  }
}

const PORY_COLORS = {
  ok: 0x7fc13a,
  info: 0x00c17d,
  error: 0xff0041,
  danger: 0xff8931,
  warning: 0xfdbe4a,
};
