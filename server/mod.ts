import { Hono } from "hono";
import nacl from "tweetnacl";
import { Buffer } from "node:buffer";

export const hono = new Hono().post("/");
