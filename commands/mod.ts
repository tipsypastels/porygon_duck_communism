import { registrar } from "../server/command/registrar.ts";
import ping from "./ping.ts";

export function addAllCommands() {
  registrar.add(ping);
}
