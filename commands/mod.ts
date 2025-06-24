import { CommandRegistrar } from "../server/bot/command/registrar.ts";
import { eightBall } from "./8ball.ts";
import { calc } from "./calc.ts";
import { ping } from "./ping.ts";

export function addCommands(registrar: CommandRegistrar) {
  registrar
    .add(eightBall)
    .add(calc)
    .add(ping);
}
