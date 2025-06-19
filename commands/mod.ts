import { addCommand } from "../server/command/registrar.ts";
import ping from "./ping.ts";

export function addAllCommands() {
  addCommand(ping);
}
