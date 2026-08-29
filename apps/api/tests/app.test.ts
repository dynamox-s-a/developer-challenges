import { randomUUID } from "node:crypto";

import { apiErrorSchema, loginResponseSchema } from "@dyn/contracts";
import { beforeEach, describe, expect, it } from "vitest";

import { type AppType, createApp } from "../src/app.js";
import { type AppRepository, createServices } from "../src/dependencies.js";
import { createAuthService } from "../src/modules/auth.js";
import { inMemoryUsers } from "./in-memory-users.js";

function unstubbed(name: string) {
  return async (): Promise<never> => {
    throw new Error(`Repository method ${name} was not stubbed`);
  };
}

// Everything these tests exercise is rejected before the database is reached, so each test stubs
// only the repository methods its request is allowed to touch; auth alone gets a working
// in-memory user store. Full flows run against real Postgres in database.integration.test.ts.
function stubRepository(overrides: Partial<AppRepository> = {}): AppRepository {
  return {
    ...inMemoryUsers(),
    health: unstubbed("health"),
    listMachines: unstubbed("listMachines"),
    findMachine: unstubbed("findMachine"),
    createMachine: unstubbed("createMachine"),
    updateMachine: unstubbed("updateMachine"),
    deleteMachine: unstubbed("deleteMachine"),
    createMonitoringPoint: unstubbed("createMonitoringPoint"),
    listMonitoringPointsForMachine: unstubbed("listMonitoringPointsForMachine"),
    attachSensor: unstubbed("attachSensor"),
    listMonitoringPoints: unstubbed("listMonitoringPoints"),
    findMonitoringPointContext: unstubbed("findMonitoringPointContext"),
    createTimeSeries: unstubbed("createTimeSeries"),
    listTimeSeries: unstubbed("listTimeSeries"),
    findTimeSeries: unstubbed("findTimeSeries"),
    listTimeSeriesSamples: unstubbed("listTimeSeriesSamples"),
    calculateTimeSeriesMetrics: unstubbed("calculateTimeSeriesMetrics"),
    deleteTimeSeries: unstubbed("deleteTimeSeries"),
    ...overrides,
  };
}

function createTestApp(overrides: Partial<AppRepository> = {}): AppType {
  const repository = stubRepository(overrides);
  return createApp({
    repository,
    services: createServices(repository),
    auth: createAuthService({
      repository,
      jwtSecret: "test-secret-that-is-at-least-32-characters",
      expiresInSeconds: 900,
    }),
  });
}

async function registerToken(app: AppType): Promise<string> {
  const response = await app.request("/api/v1/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "tester@dynamox.local",
      password: "tester-password",
    }),
  });
  const session = loginResponseSchema.parse(await response.json());
  return session.accessToken;
}

describe("HTTP boundary", () => {
  let app: AppType;
  let accessToken: string;

  beforeEach(async () => {
    app = createTestApp();
    accessToken = await registerToken(app);
  });

  function authorizedJson(method: string, body?: unknown): RequestInit {
    return {
      method,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    };
  }

  it("protects domain routes and exposes the registered user", async () => {
    const unauthorized = await app.request("/api/v1/machines");
    expect(unauthorized.status).toBe(401);
    const unauthorizedError = apiErrorSchema.parse(await unauthorized.json());
    expect(unauthorizedError.error.code).toBe("AUTHENTICATION_REQUIRED");

    const me = await app.request("/api/v1/auth/me", {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    const meBody = await me.json();
    expect(meBody).toEqual({ user: { email: "tester@dynamox.local" } });
  });

  it("registers with a 201, rejects the duplicate with a 409, and logs the account in", async () => {
    const registration = await app.request("/api/v1/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "Second@dynamox.local", password: "second-password" }),
    });
    expect(registration.status).toBe(201);
    const session = loginResponseSchema.parse(await registration.json());
    expect(session.user).toEqual({ email: "second@dynamox.local" });

    const duplicate = await app.request("/api/v1/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "second@dynamox.local", password: "other-password" }),
    });
    expect(duplicate.status).toBe(409);
    const duplicateError = apiErrorSchema.parse(await duplicate.json());
    expect(duplicateError.error.code).toBe("CONFLICT");

    const login = await app.request("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "second@dynamox.local", password: "second-password" }),
    });
    expect(login.status).toBe(200);
  });

  it("rejects a registration password below eight characters", async () => {
    const response = await app.request("/api/v1/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "short@dynamox.local", password: "short" }),
    });

    expect(response.status).toBe(400);
    const responseError = apiErrorSchema.parse(await response.json());
    expect(responseError.error.code).toBe("VALIDATION_ERROR");
  });

  it("maps schema failures to 400 issues before any repository access", async () => {
    const invalidMachine = await app.request(
      "/api/v1/machines",
      authorizedJson("POST", { name: "", type: "Motor" })
    );
    expect(invalidMachine.status).toBe(400);
    const invalidMachineError = apiErrorSchema.parse(await invalidMachine.json());
    expect(invalidMachineError.error.issues).not.toHaveLength(0);
  });

  it("rejects duplicate timestamps across timezone spellings", async () => {
    const now = new Date("2026-08-24T12:00:00.000Z");
    const pointId = randomUUID();
    const duplicateApp = createTestApp({
      findMonitoringPointContext: async () => ({
        point: {
          id: pointId,
          machineId: randomUUID(),
          name: "Drive end",
          createdAt: now,
          updatedAt: now,
        },
        sensor: { id: "sensor-1", monitoringPointId: pointId, model: "HF+", createdAt: now },
      }),
    });
    const token = await registerToken(duplicateApp);

    const duplicate = await duplicateApp.request(
      `/api/v1/monitoring-points/${pointId}/time-series`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({
          samples: [
            { timestamp: "2026-08-24T12:00:00.000Z", x: 1, y: 2, z: 3 },
            { timestamp: "2026-08-24T09:00:00.000-03:00", x: 4, y: 5, z: 6 },
          ],
        }),
      }
    );
    expect(duplicate.status).toBe(400);
    const duplicateError = apiErrorSchema.parse(await duplicate.json());
    expect(duplicateError.error.issues).toEqual([
      { path: "samples", message: "Duplicate timestamps are not allowed" },
    ]);
  });

  it("rejects a 10,001-sample payload at the HTTP boundary", async () => {
    const samples = Array.from({ length: 10_001 }, (_, index) => ({
      timestamp: new Date(Date.UTC(2026, 7, 24) + index).toISOString(),
      x: index,
      y: index,
      z: index,
    }));
    const response = await app.request(
      `/api/v1/monitoring-points/${randomUUID()}/time-series`,
      authorizedJson("POST", { samples })
    );

    expect(response.status).toBe(400);
    const responseError = apiErrorSchema.parse(await response.json());
    expect(responseError.error.code).toBe("VALIDATION_ERROR");
  });
});
