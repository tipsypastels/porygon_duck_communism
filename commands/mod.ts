import { registrar } from "../server/command/registrar.ts";
import { eightBall } from "./8ball.ts";
import { calc } from "./calc.ts";
import { ping } from "./ping.ts";
import { pory } from "./pory.ts";

export function addAllCommands() {
  registrar
    .add(eightBall)
    .add(calc)
    .add(ping)
    .add(pory);
}
