import * as Discord from "discord-api-types";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { HTTPException } from "hono/http-exception";
import { Buffer } from "node:buffer";
import nacl from "tweetnacl";
import { runCommand } from "./command/runner.ts";
import { PUBLIC_KEY } from "./env.ts";

export const hono = new Hono()
  .use(serveStatic({ root: "public" }))
  .post(
    "/send",
    async (ctx, next) => {
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
    },
    async (ctx) => {
      const interaction: Discord.APIInteraction = await ctx.req.json();

      if (interaction.type === Discord.InteractionType.Ping) {
        return ctx.json(
          {
            type: Discord.InteractionResponseType.Pong,
          } satisfies Discord.APIInteractionResponse,
        );
      }

      if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const response = await runCommand(interaction);
        return ctx.json(response);
      }

      throw new HTTPException(400, { message: "bad request" });
    },
  );
