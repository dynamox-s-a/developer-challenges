import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app";

describe("auth", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /machines requires auth", async () => {
    const res = await app.inject({ method: "GET", url: "/machines" });
    expect(res.statusCode).toBe(401);
  });

  it("POST /auth/login returns token for valid credentials (seed required)", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { username: "admin", password: "admin" },
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(20);
  });
});
