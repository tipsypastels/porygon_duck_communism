import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { HTTPException } from "hono/http-exception";
import { Buffer } from "node:buffer";
import nacl from "tweetnacl";
import { PUBLIC_KEY } from "./env.ts";
import { APIInteraction, InteractionType } from "discord.js";

export const hono = new Hono()
  .use(serveStatic({ root: "public" }))
  .post(
    "/send",
    async (ctx, next) => {
      const signature = ctx.req.header("X-Signature-Ed25519") ?? "";
      const timestamp = ctx.req.header("X-Signature-Timestamp") ?? "";
      const body = await ctx.req.text();

      const valid = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, "hex"),
        Buffer.from(PUBLIC_KEY, "hex"),
      );

      if (!valid) {
        throw new HTTPException(401, { message: "invalid request signature" });
      }

      return next();
    },
    async (ctx) => {
      const json: APIInteraction = await ctx.req.json();
    },
  );
