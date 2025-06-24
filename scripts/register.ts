import { addCommands } from "../commands/mod.ts";
import { registrar } from "../server/discord/command/registrar/mod.ts";

addCommands();

await registrar.register();
