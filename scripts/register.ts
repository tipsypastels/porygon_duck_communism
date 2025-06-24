import { addCommands } from "../commands/mod.ts";
import { registrar } from "../server/discord/command/registrar.ts";

addCommands();

await registrar.register({ writeManifest: true });
