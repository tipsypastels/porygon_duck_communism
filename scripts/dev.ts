import {
  APIInteraction,
  APIInteractionResponse,
  Client,
  Events,
} from "npm:discord.js@^14.20.0";
import { addCommands } from "../commands/mod.ts";
import { registrar } from "../server/discord/command/registrar/mod.ts";
import { BOT_TOKEN } from "../server/discord/env.ts";
import { postInteractionCallback } from "../server/discord/rest.ts";
import { hono } from "../server/mod.ts";
import { startQueues } from "../server/queue.ts";

const client = new Client({ intents: [] });

client.once(Events.ClientReady, (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.Raw, async (data) => {
  if (data.t !== "INTERACTION_CREATE") {
    return;
  }

  const interaction: APIInteraction = data.d;
  const res = await hono.request("/send", {
    method: "POST",
    body: JSON.stringify(interaction),
  });

  if (res.status !== 200) {
    return void console.error("Failed to proxy interaction");
  }

  const callback: APIInteractionResponse = await res.json();
  await postInteractionCallback(interaction.id, interaction.token, callback);
});

addCommands();
startQueues();

await Promise.all([
  registrar.registerChanges(),
  client.login(BOT_TOKEN),
]);

Deno.serve(hono.fetch);
