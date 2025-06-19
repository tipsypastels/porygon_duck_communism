import { Command } from "./mod.ts";

export const registrar = await (async () => {
  const registered = new Map<string, Command>();
  const unregistered: Command[] = [];

  return {
    add(command: Command) {
      unregistered.push(command);
      return this;
    },
  };
})();
