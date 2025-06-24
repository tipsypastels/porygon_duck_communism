import { registrar } from "../server/discord/command/registrar/mod.ts";
import { eightBall } from "./8ball.ts";
import { calc } from "./calc.ts";
import { ping } from "./ping.ts";
import { pory } from "./pory.ts";

export function addCommands() {
  registrar
    .add(eightBall)
    .add(calc)
    .add(ping)
    .add(pory);
}
