import { Command } from "./mod.ts";
import { walk } from "@std/fs";
import { relative } from "@std/path";

const DIR = new URL("../../commands", import.meta.url);

export const registrar = await (async () => {
  const registered = new Map<string, Command>();
  const unregistered = [];

  for await (const entry of walk(DIR)) {
    if (!entry.isFile) {
      continue;
    }
    if (!entry.name.startsWith("+")) {
      continue;
    }

    const importPath = relative(DIR.pathname, entry.path);
    const module = await import(`./../../commands/${importPath}`);
    const command: Command | undefined = module.default;

    if (!command) {
      console.warn(`${importPath} does not default-export a command`);
      continue;
    }

    console.log(command);
    unregistered.push(command);
  }

  console.log(unregistered.length, "commands");

  return {};
})();
