import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { hono } from "../../server/mod.ts";

describe("ping", () => {
  it("pongs", async () => {
    const res = await hono.request("/send", { method: "post" });
    expect(res.status).toBe(200);
  });
});
