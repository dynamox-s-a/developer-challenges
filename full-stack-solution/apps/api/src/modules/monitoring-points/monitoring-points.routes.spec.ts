import { Router, type Express } from "express";
import request from "supertest";
import type { MonitoringPoint } from "@full-stack-solution/shared";
import { createApp } from "../../app";
import { createAuthMiddleware } from "../auth/auth.middleware";
import { TokenService } from "../auth/token.service";
import { ConflictError } from "../../shared/errors/app-error";
import { createMonitoringPointsModule } from "./monitoring-points.module";
import type { MonitoringPointsRepository } from "./monitoring-points.repository";

const point: MonitoringPoint = {
  id: "p1",
  name: "Mancal",
  machineId: "m1",
  machineName: "Bomba 01",
  machineType: "Pump",
  sensorId: null,
  sensorModel: null,
};

describe("monitoring points routes", () => {
  const tokenService = new TokenService("s".repeat(32), "1h");
  const auth = `Bearer ${tokenService.sign("u1")}`;
  let repository: jest.Mocked<MonitoringPointsRepository>;
  let app: Express;

  beforeEach(() => {
    repository = {
      machineBelongsToUser: jest.fn(),
      create: jest.fn(),
      findOwned: jest.fn(),
      rename: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      replaceSensor: jest.fn(),
      deleteSensor: jest.fn(),
    };
    const module = createMonitoringPointsModule(
      repository,
      createAuthMiddleware(tokenService),
    );
    app = createApp({ auth: Router(), monitoringPoints: module.router });
  });

  it.each([
    ["post", "/api/machines/m1/monitoring-points"],
    ["get", "/api/monitoring-points"],
    ["patch", "/api/monitoring-points/p1"],
    ["delete", "/api/monitoring-points/p1"],
    ["put", "/api/monitoring-points/p1/sensor"],
    ["delete", "/api/monitoring-points/p1/sensor"],
  ] as const)("%s %s requires authentication", async (method, path) => {
    expect((await request(app)[method](path)).status).toBe(401);
  });

  describe("POST /api/machines/:id/monitoring-points", () => {
    const post = (body: object) =>
      request(app)
        .post("/api/machines/m1/monitoring-points")
        .set("Authorization", auth)
        .send(body);

    it("creates a point", async () => {
      repository.machineBelongsToUser.mockResolvedValue(true);
      repository.create.mockResolvedValue(point);

      const response = await post({ name: "Mancal" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(point);
      expect(repository.create).toHaveBeenCalledWith("u1", "m1", "Mancal");
    });

    it("returns 404 when the machine is not the user's", async () => {
      repository.machineBelongsToUser.mockResolvedValue(false);
      expect((await post({ name: "Mancal" })).status).toBe(404);
    });

    it("returns 400 for an empty name", async () => {
      expect((await post({ name: "  " })).status).toBe(400);
    });
  });

  describe("GET /api/monitoring-points", () => {
    const emptyPage = { data: [], page: 1, pageSize: 5, total: 0 };

    it("uses the defaults: page 1, 5 items, sorted by machine name", async () => {
      repository.list.mockResolvedValue(emptyPage);

      const response = await request(app)
        .get("/api/monitoring-points")
        .set("Authorization", auth);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyPage);
      expect(repository.list).toHaveBeenCalledWith("u1", {
        page: 1,
        pageSize: 5,
        sortBy: "machineName",
        order: "asc",
      });
    });

    it("passes the requested page and sort to the repository", async () => {
      repository.list.mockResolvedValue(emptyPage);

      await request(app)
        .get("/api/monitoring-points?page=2&sortBy=sensorModel&order=desc")
        .set("Authorization", auth);

      expect(repository.list).toHaveBeenCalledWith("u1", {
        page: 2,
        pageSize: 5,
        sortBy: "sensorModel",
        order: "desc",
      });
    });

    it.each(["sortBy=banana", "order=sideways", "page=0", "pageSize=500"])(
      "returns 400 for ?%s",
      async (query) => {
        const response = await request(app)
          .get(`/api/monitoring-points?${query}`)
          .set("Authorization", auth);

        expect(response.status).toBe(400);
        expect(repository.list).not.toHaveBeenCalled();
      },
    );
  });

  describe("PUT /api/monitoring-points/:id/sensor", () => {
    const put = (body: object) =>
      request(app)
        .put("/api/monitoring-points/p1/sensor")
        .set("Authorization", auth)
        .send(body);

    it("returns 422 for TcAg on a Pump and never replaces the sensor", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Pump" });

      const response = await put({ id: "S-1", model: "TcAg" });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe("BUSINESS_RULE_VIOLATION");
      expect(repository.replaceSensor).not.toHaveBeenCalled();
    });

    it("installs HF+ on a Pump", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Pump" });
      const sensor = { id: "S-1", model: "HF+", monitoringPointId: "p1" };
      repository.replaceSensor.mockResolvedValue(sensor as never);

      const response = await put({ id: "S-1", model: "HF+" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(sensor);
    });

    it("returns 409 when the sensor ID is installed on another point", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Fan" });
      repository.replaceSensor.mockRejectedValue(new ConflictError("in use"));

      const response = await put({ id: "S-1", model: "TcAg" });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe("CONFLICT");
    });

    it("returns 404 when the point is not the user's", async () => {
      repository.findOwned.mockResolvedValue(null);
      expect((await put({ id: "S-1", model: "HF+" })).status).toBe(404);
    });

    it("returns 400 for an unknown model", async () => {
      expect((await put({ id: "S-1", model: "XYZ" })).status).toBe(400);
    });
  });

  describe("DELETE /api/monitoring-points/:id/sensor", () => {
    const remove = () =>
      request(app)
        .delete("/api/monitoring-points/p1/sensor")
        .set("Authorization", auth);

    it("returns 204 when the sensor was removed", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Fan" });
      repository.deleteSensor.mockResolvedValue(true);

      expect((await remove()).status).toBe(204);
    });

    it("returns 404 when the point has no sensor", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Fan" });
      repository.deleteSensor.mockResolvedValue(false);

      expect((await remove()).status).toBe(404);
    });
  });

  describe("PATCH and DELETE /api/monitoring-points/:id", () => {
    it("renames a point", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Pump" });
      repository.rename.mockResolvedValue({ ...point, name: "Novo nome" });

      const response = await request(app)
        .patch("/api/monitoring-points/p1")
        .set("Authorization", auth)
        .send({ name: "Novo nome" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Novo nome");
    });

    it("deletes a point, and returns 404 when it is not the user's", async () => {
      repository.delete
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      const call = () =>
        request(app)
          .delete("/api/monitoring-points/p1")
          .set("Authorization", auth);

      expect((await call()).status).toBe(204);
      expect((await call()).status).toBe(404);
    });
  });
});
