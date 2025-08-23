import { describe, expect, it } from "bun:test";
import app from "../index";

describe("My first Test", () => {
  it("Should return 200 response", async () => {
    const req = new Request("http://localhost:3000/");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
});
