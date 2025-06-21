import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Buffer } from "node:buffer";
import nacl from "tweetnacl";
import { PUBLIC_KEY } from "./env.ts";

export function signature({ enabled = true }) {
  return createMiddleware(async (ctx, next) => {
    if (!enabled) {
      return next();
    }

    const signature = ctx.req.header("X-Signature-Ed25519") ?? "";
    const timestamp = ctx.req.header("X-Signature-Timestamp") ?? "";
    const body = await ctx.req.text();

    let valid: boolean;

    try {
      valid = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, "hex"),
        Buffer.from(PUBLIC_KEY, "hex"),
      );
    } catch {
      valid = false;
    }

    if (!valid) {
      throw new HTTPException(401, { message: "invalid request signature" });
    }

    return next();
  });
}
