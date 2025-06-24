import { httpAssert, httpException } from "$util/assert.ts";
import * as Discord from "discord-api-types";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { Buffer } from "node:buffer";
import nacl from "tweetnacl";
import { runCommand } from "./discord/command/mod.ts";
import { PUBLIC_KEY } from "./discord/env.ts";
import { DEV } from "./env.ts";

export const hono = new Hono()
  .use(serveStatic({ root: "public" }))
  .post(
    "/send",
    async (ctx, next) => {
      if (DEV) {
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

      httpAssert(valid, { code: 401, message: "invalid request signature" });
      return next();
    },
    async (ctx) => {
      console.log("Received interaction");

      const interaction: Discord.APIInteraction = await ctx.req.json();
      const respond = (response: Discord.APIInteractionResponse) => {
        console.log("Responding to interaction", response);
        return ctx.json(response);
      };

      switch (interaction.type) {
        case Discord.InteractionType.Ping: {
          return respond({ type: Discord.InteractionResponseType.Pong });
        }
        case Discord.InteractionType.ApplicationCommand: {
          httpAssert(
            interaction.data.type == Discord.ApplicationCommandType.ChatInput,
            { code: 400, message: "bad request" },
          );

          const response = await runCommand(
            interaction as Discord.APIChatInputApplicationCommandInteraction,
          );
          return respond(response);
        }
        default: {
          httpException({ code: 400, message: "bad request" });
        }
      }
    },
  );
