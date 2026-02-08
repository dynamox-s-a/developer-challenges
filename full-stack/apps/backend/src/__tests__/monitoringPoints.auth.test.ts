import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app";
import { loginAndGetToken } from "./helpers/auth";

describe("monitoring-points (auth)", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("requires auth", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/monitoring-points?take=5&skip=0&sortBy=machineName&sortOrder=asc",
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns data with valid token", async () => {
    const token = await loginAndGetToken(app);

    const res = await app.inject({
      method: "GET",
      url: "/monitoring-points?take=5&skip=0&sortBy=machineName&sortOrder=asc",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body) as {
      items: unknown[];
      total: number;
      take: number;
      skip: number;
      sortBy: string;
      sortOrder: string;
    };

    expect(Array.isArray(body.items)).toBe(true);
    expect(typeof body.total).toBe("number");
    expect(body.take).toBe(5);
    expect(body.skip).toBe(0);
    expect(body.sortBy).toBe("machineName");
    expect(body.sortOrder).toBe("asc");
  });
});
