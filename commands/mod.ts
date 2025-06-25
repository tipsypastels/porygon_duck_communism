import { registrar } from "../server/discord/command/registrar/mod.ts";
import { eightBall } from "./8ball.ts";
import { calc } from "./calc.ts";
import { headpat } from "./headpat.ts";
import { hug } from "./hug.ts";
import { nudge } from "./nudge.ts";
import { ping } from "./ping.ts";
import { pory } from "./pory.ts";
import { vibe } from "./vibe.ts";

export function addCommands() {
  registrar
    .add(eightBall)
    .add(calc)
    .add(headpat)
    .add(hug)
    .add(nudge)
    .add(ping)
    .add(pory)
    .add(vibe);
}
