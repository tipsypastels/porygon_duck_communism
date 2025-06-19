import { addCommand } from "../server/command/registrar.ts";
import ping from "./ping.ts";

addCommand(ping);
