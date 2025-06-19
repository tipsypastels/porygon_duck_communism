import { REST } from "@discordjs/rest";
import { BOT_TOKEN } from "./env.ts";

export const rest = new REST().setToken(BOT_TOKEN);
