import { registrar } from "../server/command/registrar.ts";
import ping from "./ping.ts";

registrar.add(ping);
