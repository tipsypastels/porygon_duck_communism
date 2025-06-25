import { IntoEmbedFn } from "../embed.ts";

const FRIEND: unique symbol = Symbol();

export class UsageError {
  constructor(
    _: typeof FRIEND,
    readonly code: string,
    readonly ephemeral: boolean,
    readonly intoEmbed: IntoEmbedFn<[commandName: string]>,
  ) {}
}

export interface UsageErrorOptions {
  code: string;
  ephemeral?: boolean;
}

export function usageError<P extends unknown[]>(
  codeOrOptions: string | UsageErrorOptions,
  f: IntoEmbedFn<P>,
) {
  const { code, ephemeral = true }: UsageErrorOptions =
    typeof codeOrOptions === "string" ? { code: codeOrOptions } : codeOrOptions;

  return (...params: P) =>
    new UsageError(FRIEND, code, ephemeral, (embed, commandName) => {
      embed
        .into(f, ...params)
        .setFooterText(`Error Code: ${commandName}.${code}`);
    });
}
