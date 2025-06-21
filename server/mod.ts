import * as Discord from "discord-api-types";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { HTTPException } from "hono/http-exception";
import { runCommand } from "./command/runner.ts";
import { DEV } from "./env.ts";
import { signature } from "./signature.ts";

export const hono = new Hono()
  .use(serveStatic({ root: "public" }))
  .post(
    "/send",
    signature({ enabled: !DEV }),
    async (ctx) => {
      const interaction: Discord.APIInteraction = await ctx.req.json();

      console.log("Received interaction", interaction);

      const respond = (response: Discord.APIInteractionResponse) => {
        console.log("Responding to interaction", response);
        return ctx.json(response);
      };

      if (interaction.type === Discord.InteractionType.Ping) {
        return respond({
          type: Discord.InteractionResponseType.Pong,
        });
      }

      if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        try {
          const response = await runCommand(interaction);
          return respond(response);
        } catch (e) {
          console.log("Error", e);
          return respond({ type: 4, data: { content: "ooops" } });
        }
      }

      throw new HTTPException(400, { message: "bad request" });
    },
  );
