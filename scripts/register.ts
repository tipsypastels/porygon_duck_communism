import { addAllCommands } from "../commands/mod.ts";
import { registrar } from "../server/command/registrar.ts";

addAllCommands();
await registrar.register({ writeManifest: true });
