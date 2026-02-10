import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app";

describe("health", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health returns ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
    expect(body.server).toMatch(/^[a-zA-Z0-9-]+$/);
    expect(body.timestamp).toBeDefined();
  });
});
