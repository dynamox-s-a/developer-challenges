import {
  apiErrorSchema,
  loginResponseSchema,
  type MonitoringPointListItem,
  type MonitoringPointSortBy,
  type SensorModel,
  type SortOrder,
} from "@dyn/contracts";
import {
  createDatabase,
  type DatabaseClient,
  machines,
  monitoringPoints,
  sensors,
  timeSeries,
  timeSeriesSamples,
  users,
} from "@dyn/database";
import { count, eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { type AppType, createApp } from "../src/app.js";
import {
  type AppRepository,
  createAppRepository,
  createServices,
  type Services,
} from "../src/dependencies.js";
import { createAuthService } from "../src/modules/auth.js";

const databaseUrl = process.env.DATABASE_URL;
const databaseSuite = process.env.NODE_ENV === "test" && databaseUrl ? describe : describe.skip;
const passwordSalt = "ZHluYW1veC1kZXYtc2FsdA==";
const passwordHash =
  "q+15C3iVTh7UHaGBcAwbXsjT9/DnspRRfNdXqlfIe4AC870Xh71DEnApN8mKnfeni/uAoq6yY/stF689IMB1PA==";
const jwtSecret = "database-integration-secret-at-least-32-characters";

function capture<T>(promise: Promise<T>): Promise<PromiseSettledResult<T>> {
  return promise.then(
    (value) => ({ status: "fulfilled", value }),
    (reason: unknown) => ({ status: "rejected", reason })
  );
}

databaseSuite("PostgreSQL repository integration", () => {
  let client: DatabaseClient;
  let repository: AppRepository;
  let services: Services;
  let app: AppType;
  let accessToken: string;

  beforeAll(() => {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required for database integration tests");
    }
    client = createDatabase(databaseUrl);
    repository = createAppRepository(client.db);
    services = createServices(repository);
    app = createApp({
      repository,
      services,
      auth: createAuthService({
        repository,
        jwtSecret,
        expiresInSeconds: 900,
      }),
    });
  });

  beforeEach(async () => {
    await client.db.delete(machines);
    await client.db.delete(users);
    const seededAdmin = await repository.createUser({
      email: "admin@dynamox.local",
      passwordSalt,
      passwordHash,
    });
    if (!seededAdmin) {
      throw new Error("Admin user could not be seeded");
    }
    const login = await app.request("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "admin@dynamox.local",
        password: "dynamox",
      }),
    });
    accessToken = loginResponseSchema.parse(await login.json()).accessToken;
  });

  afterAll(async () => {
    await client.db.delete(machines);
    await client.db.delete(users);
    await client.close();
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

  async function createPointWithSensor(options: {
    machineName: string;
    machineType: "Pump" | "Fan";
    pointName: string;
    sensorId: string;
    sensorModel: SensorModel;
  }) {
    const machine = await services.machines.create({
      name: options.machineName,
      type: options.machineType,
    });
    const point = await services.monitoringPoints.create(machine.id, {
      name: options.pointName,
    });
    const sensor = await services.monitoringPoints.attachSensor(point.id, {
      sensorId: options.sensorId,
      model: options.sensorModel,
    });
    return { machine, point, sensor };
  }

  async function waitForBlockedDatabaseOperations(expected: number): Promise<void> {
    const deadline = Date.now() + 5_000;

    while (Date.now() < deadline) {
      const result = await client.db.execute<{ blocked: number }>(sql`
        select count(*)::int as blocked
        from pg_stat_activity
        where datname = current_database()
          and usename = current_user
          and wait_event_type = 'Lock'
      `);

      if ((result.rows[0]?.blocked ?? 0) >= expected) {
        return;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 10));
    }

    throw new Error(`Timed out waiting for ${expected} blocked database operations`);
  }

  async function whileHoldingMachineLock(
    machineId: string,
    queueOperations: () => Promise<void>
  ): Promise<void> {
    await client.db.transaction(async (transaction) => {
      const locked = await transaction
        .select({ id: machines.id })
        .from(machines)
        .where(eq(machines.id, machineId))
        .for("update");

      if (locked.length !== 1) {
        throw new Error("Test machine could not be locked");
      }

      await queueOperations();
    });
  }

  it("registers accounts against the real unique index, including under concurrency", async () => {
    function registerRequest(email: string, password: string) {
      return app.request("/api/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    }

    const created = await registerRequest("operator@dynamox.local", "operator-password");
    expect(created.status).toBe(201);
    const session = loginResponseSchema.parse(await created.json());
    expect(session.user).toEqual({ email: "operator@dynamox.local" });

    const seededConflict = await registerRequest("Admin@dynamox.local", "whatever-password");
    expect(seededConflict.status).toBe(409);

    // Two simultaneous registrations for one email must resolve through the unique index: exactly
    // one 201 and one 409, never two rows.
    const [first, second] = await Promise.all([
      registerRequest("raced@dynamox.local", "raced-password"),
      registerRequest("raced@dynamox.local", "raced-password"),
    ]);
    expect([first.status, second.status].sort()).toEqual([201, 409]);

    const login = await app.request("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "operator@dynamox.local", password: "operator-password" }),
    });
    expect(login.status).toBe(200);
    const loginSession = loginResponseSchema.parse(await login.json());

    const me = await app.request("/api/v1/auth/me", {
      headers: { authorization: `Bearer ${loginSession.accessToken}` },
    });
    const meBody = await me.json();
    expect(meBody).toEqual({ user: { email: "operator@dynamox.local" } });
  });

  it("accepts every sensor model on Fans and rejects duplicate IDs or a second point sensor", async () => {
    const machine = await services.machines.create({ name: "Sensor fan", type: "Fan" });
    const models: SensorModel[] = ["TcAg", "TcAs", "HF+"];

    for (const [index, model] of models.entries()) {
      const point = await services.monitoringPoints.create(machine.id, {
        name: `Point ${index + 1}`,
      });
      const sensor = await services.monitoringPoints.attachSensor(point.id, {
        sensorId: `fan-sensor-${index + 1}`,
        model,
      });
      expect(sensor.model).toBe(model);
    }

    const conflictPoint = await services.monitoringPoints.create(machine.id, {
      name: "Conflict point",
    });
    await expect(
      services.monitoringPoints.attachSensor(conflictPoint.id, {
        sensorId: "fan-sensor-1",
        model: "TcAg",
      })
    ).rejects.toMatchObject({ code: "CONFLICT", status: 409 });

    await services.monitoringPoints.attachSensor(conflictPoint.id, {
      sensorId: "fan-sensor-4",
      model: "TcAg",
    });
    await expect(
      services.monitoringPoints.attachSensor(conflictPoint.id, {
        sensorId: "fan-sensor-5",
        model: "TcAs",
      })
    ).rejects.toMatchObject({ code: "CONFLICT", status: 409 });
  });

  it("changes machine type only while the attached sensors stay compatible", async () => {
    const bare = await services.machines.create({ name: "Bare fan", type: "Fan" });
    expect(await services.machines.update(bare.id, { type: "Pump" })).toMatchObject({
      name: "Bare fan",
      type: "Pump",
    });
    expect(
      await services.machines.update(bare.id, { name: "Renamed fan", type: "Fan" })
    ).toMatchObject({ name: "Renamed fan", type: "Fan" });

    const { machine } = await createPointWithSensor({
      machineName: "Thermocouple fan",
      machineType: "Fan",
      pointName: "Drive end",
      sensorId: "type-change-sensor",
      sensorModel: "TcAg",
    });
    const secondPoint = await services.monitoringPoints.create(machine.id, {
      name: "Non-drive end",
    });
    await services.monitoringPoints.attachSensor(secondPoint.id, {
      sensorId: "type-change-sensor-tcas",
      model: "TcAs",
    });

    await expect(services.machines.update(machine.id, { type: "Pump" })).rejects.toMatchObject({
      code: "SENSOR_INCOMPATIBLE",
      status: 422,
    });
    expect(await services.machines.get(machine.id)).toMatchObject({ type: "Fan" });

    const response = await app.request(
      `/api/v1/machines/${machine.id}`,
      authorizedJson("PATCH", { type: "Pump" })
    );
    expect(response.status).toBe(422);
    const responseError = apiErrorSchema.parse(await response.json()).error;
    expect(responseError).toMatchObject({
      code: "SENSOR_INCOMPATIBLE",
      issues: [{ path: "type" }],
    });
    expect(responseError.message).toContain("TcAg");
    expect(responseError.message).toContain("TcAs");

    expect(await services.machines.update(machine.id, { name: "Still a fan" })).toMatchObject({
      name: "Still a fan",
      type: "Fan",
    });
  });

  it("serializes incompatible sensor attachment and Fan-to-Pump changes in both lock orderings", async () => {
    const attachmentFirstMachine = await services.machines.create({
      name: "Attachment first",
      type: "Fan",
    });
    const attachmentFirstPoint = await services.monitoringPoints.create(attachmentFirstMachine.id, {
      name: "Drive end",
    });
    const attachmentFirstResults: Array<Promise<PromiseSettledResult<unknown>>> = [];

    await whileHoldingMachineLock(attachmentFirstMachine.id, async () => {
      attachmentFirstResults.push(
        capture(
          services.monitoringPoints.attachSensor(attachmentFirstPoint.id, {
            sensorId: "attachment-wins",
            model: "TcAg",
          })
        )
      );
      await waitForBlockedDatabaseOperations(1);

      attachmentFirstResults.push(
        capture(services.machines.update(attachmentFirstMachine.id, { type: "Pump" }))
      );
      await waitForBlockedDatabaseOperations(2);
    });

    const [attachmentWon, promotionLost] = await Promise.all(attachmentFirstResults);
    expect(attachmentWon).toMatchObject({
      status: "fulfilled",
      value: { id: "attachment-wins", model: "TcAg" },
    });
    expect(promotionLost).toMatchObject({
      status: "rejected",
      reason: { code: "SENSOR_INCOMPATIBLE", status: 422 },
    });
    expect(await services.machines.get(attachmentFirstMachine.id)).toMatchObject({ type: "Fan" });

    const promotionFirstMachine = await services.machines.create({
      name: "Promotion first",
      type: "Fan",
    });
    const promotionFirstPoint = await services.monitoringPoints.create(promotionFirstMachine.id, {
      name: "Drive end",
    });
    const promotionFirstResults: Array<Promise<PromiseSettledResult<unknown>>> = [];

    await whileHoldingMachineLock(promotionFirstMachine.id, async () => {
      promotionFirstResults.push(
        capture(services.machines.update(promotionFirstMachine.id, { type: "Pump" }))
      );
      await waitForBlockedDatabaseOperations(1);

      promotionFirstResults.push(
        capture(
          services.monitoringPoints.attachSensor(promotionFirstPoint.id, {
            sensorId: "promotion-wins",
            model: "TcAs",
          })
        )
      );
      await waitForBlockedDatabaseOperations(2);
    });

    const [promotionWon, attachmentLost] = await Promise.all(promotionFirstResults);
    expect(promotionWon).toMatchObject({ status: "fulfilled", value: { type: "Pump" } });
    expect(attachmentLost).toMatchObject({
      status: "rejected",
      reason: { code: "SENSOR_INCOMPATIBLE", status: 422 },
    });
    expect(await services.machines.get(promotionFirstMachine.id)).toMatchObject({ type: "Pump" });
    expect(await services.monitoringPoints.listForMachine(promotionFirstMachine.id)).toMatchObject([
      { id: promotionFirstPoint.id, sensor: null },
    ]);
  });

  it("maps concurrent machine deletion during child creation and attachment to not found", async () => {
    const pointCreationMachine = await services.machines.create({
      name: "Delete during point creation",
      type: "Fan",
    });
    const pointCreationResults: Array<Promise<PromiseSettledResult<unknown>>> = [];

    await whileHoldingMachineLock(pointCreationMachine.id, async () => {
      pointCreationResults.push(capture(services.machines.delete(pointCreationMachine.id)));
      await waitForBlockedDatabaseOperations(1);

      pointCreationResults.push(
        capture(services.monitoringPoints.create(pointCreationMachine.id, { name: "Too late" }))
      );
      await waitForBlockedDatabaseOperations(2);
    });

    const [pointParentDeleted, pointCreationLost] = await Promise.all(pointCreationResults);
    expect(pointParentDeleted).toMatchObject({ status: "fulfilled" });
    expect(pointCreationLost).toMatchObject({
      status: "rejected",
      reason: { code: "NOT_FOUND", status: 404 },
    });

    const sensorAttachmentMachine = await services.machines.create({
      name: "Delete during sensor attachment",
      type: "Fan",
    });
    const sensorAttachmentPoint = await services.monitoringPoints.create(
      sensorAttachmentMachine.id,
      { name: "Drive end" }
    );
    const sensorAttachmentResults: Array<Promise<PromiseSettledResult<unknown>>> = [];

    await whileHoldingMachineLock(sensorAttachmentMachine.id, async () => {
      sensorAttachmentResults.push(capture(services.machines.delete(sensorAttachmentMachine.id)));
      await waitForBlockedDatabaseOperations(1);

      sensorAttachmentResults.push(
        capture(
          services.monitoringPoints.attachSensor(sensorAttachmentPoint.id, {
            sensorId: "too-late-sensor",
            model: "HF+",
          })
        )
      );
      await waitForBlockedDatabaseOperations(2);
    });

    const [sensorParentDeleted, sensorAttachmentLost] = await Promise.all(sensorAttachmentResults);
    expect(sensorParentDeleted).toMatchObject({ status: "fulfilled" });
    expect(sensorAttachmentLost).toMatchObject({
      status: "rejected",
      reason: { code: "NOT_FOUND", status: 404 },
    });
  });

  it("paginates by five and sorts every required column in both directions with null sensors last", async () => {
    const alpha = await services.machines.create({ name: "Alpha", type: "Fan" });
    const beta = await services.machines.create({ name: "Beta", type: "Pump" });
    const gamma = await services.machines.create({ name: "Gamma", type: "Fan" });

    const records: Array<{
      machineId: string;
      pointName: string;
      sensorId?: string;
      sensorModel?: SensorModel;
    }> = [
      { machineId: alpha.id, pointName: "Zulu", sensorId: "sort-1", sensorModel: "TcAs" },
      { machineId: alpha.id, pointName: "Alpha" },
      { machineId: beta.id, pointName: "Echo", sensorId: "sort-2", sensorModel: "HF+" },
      { machineId: gamma.id, pointName: "Bravo", sensorId: "sort-3", sensorModel: "TcAg" },
      { machineId: beta.id, pointName: "Delta", sensorId: "sort-4", sensorModel: "HF+" },
      { machineId: gamma.id, pointName: "Charlie", sensorId: "sort-5", sensorModel: "TcAs" },
    ];

    for (const record of records) {
      const point = await services.monitoringPoints.create(record.machineId, {
        name: record.pointName,
      });
      if (record.sensorId && record.sensorModel) {
        await services.monitoringPoints.attachSensor(point.id, {
          sensorId: record.sensorId,
          model: record.sensorModel,
        });
      }
    }

    const sortColumns: MonitoringPointSortBy[] = [
      "machineName",
      "machineType",
      "monitoringPointName",
      "sensorModel",
    ];
    const sortOrders: SortOrder[] = ["asc", "desc"];

    for (const sortBy of sortColumns) {
      for (const sortOrder of sortOrders) {
        const first = await services.monitoringPoints.list({ page: 1, sortBy, sortOrder });
        const second = await services.monitoringPoints.list({ page: 2, sortBy, sortOrder });
        const items = [...first.items, ...second.items];

        expect(first).toMatchObject({ page: 1, pageSize: 5, total: 6, totalPages: 2 });
        expect(first.items).toHaveLength(5);
        expect(second.items).toHaveLength(1);

        const value = (item: MonitoringPointListItem): string | null => {
          switch (sortBy) {
            case "machineName":
              return item.machineName;
            case "machineType":
              return item.machineType;
            case "monitoringPointName":
              return item.monitoringPointName;
            case "sensorModel":
              return item.sensorModel;
          }
        };
        const values = items.map(value);
        if (sortBy === "sensorModel") {
          expect(values.at(-1)).toBeNull();
          expect(values.slice(0, -1)).not.toContain(null);
        }
        const nonNullValues = values.filter((entry): entry is string => entry !== null);
        const expected = [...nonNullValues].sort((left, right) => left.localeCompare(right));
        if (sortOrder === "desc") {
          expected.reverse();
        }
        expect(nonNullValues).toEqual(expected);
      }
    }
  });

  it("normalizes unordered samples and returns exact totals, retrieval, metrics, and deletion behavior", async () => {
    const { point } = await createPointWithSensor({
      machineName: "Metrics fan",
      machineType: "Fan",
      pointName: "Metrics point",
      sensorId: "metrics-sensor",
      sensorModel: "TcAs",
    });
    const samples = [
      { timestamp: "2026-08-24T12:00:02.000Z", x: 3, y: 4, z: 0 },
      { timestamp: "2026-08-24T12:00:00.000Z", x: 0, y: 0, z: 12 },
      { timestamp: "2026-08-24T12:00:01.000Z", x: -3, y: -4, z: 0 },
    ];
    const created = await services.timeSeries.create(point.id, {
      label: "Unordered series",
      samples,
    });

    const detail = await services.timeSeries.get(created.id);
    expect(detail.samples).toEqual([samples[1], samples[2], samples[0]]);
    expect(detail).toMatchObject({
      label: "Unordered series",
      sampleCount: 3,
      startedAt: "2026-08-24T12:00:00.000Z",
      endedAt: "2026-08-24T12:00:02.000Z",
    });
    const everySeries = await services.timeSeries.list({ page: 1, pageSize: 20 });
    expect(everySeries.total).toBe(1);
    const byPoint = await services.timeSeries.list({
      page: 1,
      pageSize: 20,
      monitoringPointId: point.id,
    });
    expect(byPoint.total).toBe(1);
    const metrics = await services.timeSeries.metrics(created.id);
    expect(metrics).toMatchObject({
      sampleCount: 3,
      startedAt: "2026-08-24T12:00:00.000Z",
      endedAt: "2026-08-24T12:00:02.000Z",
      axes: {
        x: { min: -3, max: 3, mean: 0 },
        y: { min: -4, max: 4, mean: 0 },
        z: { min: 0, max: 12, mean: 4 },
      },
    });
    expect(metrics.axes.x.rms).toBeCloseTo(Math.sqrt(6));
    expect(metrics.axes.y.rms).toBeCloseTo(Math.sqrt(32 / 3));
    expect(metrics.axes.z.rms).toBeCloseTo(Math.sqrt(48));
    expect(metrics.vectorMagnitudeRms).toBeCloseTo(Math.sqrt(194 / 3));

    await services.timeSeries.delete(created.id);
    const afterDeletion = await services.timeSeries.list({ page: 1, pageSize: 20 });
    expect(afterDeletion.total).toBe(0);
    await expect(services.timeSeries.get(created.id)).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("cascades machine deletion through points, sensors, series, and samples", async () => {
    const { machine, point } = await createPointWithSensor({
      machineName: "Cascade fan",
      machineType: "Fan",
      pointName: "Cascade point",
      sensorId: "cascade-sensor",
      sensorModel: "HF+",
    });
    const series = await services.timeSeries.create(point.id, {
      samples: [{ timestamp: "2026-08-24T12:00:00.000Z", x: 1, y: 2, z: 3 }],
    });

    await services.machines.delete(machine.id);

    const tableCounts = await Promise.all([
      client.db.select({ value: count() }).from(machines),
      client.db.select({ value: count() }).from(monitoringPoints),
      client.db.select({ value: count() }).from(sensors),
      client.db.select({ value: count() }).from(timeSeries),
      client.db.select({ value: count() }).from(timeSeriesSamples),
    ]);
    expect(tableCounts.map((rows) => rows[0]?.value)).toEqual([0, 0, 0, 0, 0]);
    await expect(services.timeSeries.get(series.id)).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("persists and retrieves the 10,000-sample boundary atomically in a single insert", async () => {
    const { point } = await createPointWithSensor({
      machineName: "Integration fan",
      machineType: "Fan",
      pointName: "Drive end",
      sensorId: "integration-sensor",
      sensorModel: "TcAg",
    });
    const samples = Array.from({ length: 10_000 }, (_, index) => ({
      timestamp: new Date(Date.UTC(2026, 7, 24) + index).toISOString(),
      x: index,
      y: index * 2,
      z: index * 3,
    }));

    const created = await services.timeSeries.create(point.id, {
      label: "Maximum accepted payload",
      samples,
    });
    const detail = await services.timeSeries.get(created.id);
    const metrics = await services.timeSeries.metrics(created.id);

    expect(created.sampleCount).toBe(10_000);
    expect(detail.samples).toHaveLength(10_000);
    expect(detail.samples[0]?.timestamp).toBe(samples[0]?.timestamp);
    expect(detail.samples.at(-1)?.timestamp).toBe(samples.at(-1)?.timestamp);
    expect(metrics.sampleCount).toBe(10_000);
    expect(metrics.vectorMagnitudeRms).toBeGreaterThan(0);
  }, 30_000);
});
