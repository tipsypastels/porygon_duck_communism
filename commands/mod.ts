import { registrar } from "../server/command/registrar.ts";
import ping from "./ping.ts";
import world from "./world.ts";

export function addAllCommands() {
  registrar.add(ping);
  registrar.add(world);
}
