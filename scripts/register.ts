import { addAllCommands } from "../commands/mod.ts";
import { registerCommands } from "../server/command/registrar.ts";

addAllCommands();
await registerCommands();
