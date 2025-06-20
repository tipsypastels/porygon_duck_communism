import { registrar } from "../server/command/registrar.ts";
import { eightBall } from "./8ball.ts";
import { calc } from "./calc.ts";
import { ping } from "./ping.ts";

export function addAllCommands() {
  registrar.add(eightBall);
  registrar.add(calc);
  registrar.add(ping);
}
