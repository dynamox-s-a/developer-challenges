import { Router, type Express } from "express";
import request from "supertest";
import type { Machine } from "@full-stack-solution/shared";
import { createApp } from "../../app";
import { createAuthMiddleware } from "../auth/auth.middleware";
import { TokenService } from "../auth/token.service";
import { createMachinesModule } from "./machines.module";
import type { MachinesRepository } from "./machines.repository";

describe("machines API", () => {
  const tokenService = new TokenService("s".repeat(32), "1h");
  const bearer = (userId: string) => `Bearer ${tokenService.sign(userId)}`;
  const machine: Machine = {
    id: "m1",
    name: "Pump 01",
    type: "Pump",
    monitoringPointsCount: 0,
  };
  let repository: jest.Mocked<MachinesRepository>;
  let app: Express;

  beforeEach(() => {
    repository = {
      findAllByUser: jest.fn(),
      findOwned: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      hasSensorsBlockedForPump: jest.fn(),
    };
    const machines = createMachinesModule(
      repository,
      createAuthMiddleware(tokenService),
    );
    app = createApp({ auth: Router(), machines: machines.router });
  });

  it.each([
    ["get", "/api/machines"],
    ["post", "/api/machines"],
    ["patch", "/api/machines/m1"],
    ["delete", "/api/machines/m1"],
  ] as const)("%s %s requires authentication", async (method, path) => {
    const response = await request(app)[method](path);

    expect(response.status).toBe(401);
  });

  it("creates a machine for the authenticated user and ignores a forged owner", async () => {
    repository.create.mockResolvedValue(machine);

    const response = await request(app)
      .post("/api/machines")
      .set("Authorization", bearer("user-1"))
      .send({ name: "Pump 01", type: "Pump", createdById: "user-2" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(machine);
    expect(repository.create).toHaveBeenCalledWith("user-1", {
      name: "Pump 01",
      type: "Pump",
    });
  });

  it.each([
    [{ name: "Pump 01", type: "Motor" }],
    [{ name: "  ", type: "Pump" }],
  ])("rejects invalid create input: %o", async (body) => {
    const response = await request(app)
      .post("/api/machines")
      .set("Authorization", bearer("user-1"))
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("lists machines belonging to the authenticated user", async () => {
    repository.findAllByUser.mockResolvedValue([machine]);

    const response = await request(app)
      .get("/api/machines")
      .set("Authorization", bearer("user-1"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([machine]);
    expect(repository.findAllByUser).toHaveBeenCalledWith("user-1");
  });

  it("updates a machine and returns the updated representation", async () => {
    const updated = { ...machine, name: "Renamed" };
    repository.findOwned.mockResolvedValue(machine);
    repository.update.mockResolvedValue(updated);

    const response = await request(app)
      .patch("/api/machines/m1")
      .set("Authorization", bearer("user-1"))
      .send({ name: "Renamed" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith("m1", { name: "Renamed" });
  });

  it("returns 404 when the machine is not owned by the authenticated user", async () => {
    repository.findOwned.mockResolvedValue(null);

    const response = await request(app)
      .patch("/api/machines/m1")
      .set("Authorization", bearer("user-2"))
      .send({ name: "Hijacked" });

    expect(response.status).toBe(404);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("returns 409 when changing to Pump with incompatible sensors", async () => {
    repository.findOwned.mockResolvedValue({ ...machine, type: "Fan" });
    repository.hasSensorsBlockedForPump.mockResolvedValue(true);

    const response = await request(app)
      .patch("/api/machines/m1")
      .set("Authorization", bearer("user-1"))
      .send({ type: "Pump" });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CONFLICT");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deletes a machine and returns no content", async () => {
    repository.delete.mockResolvedValue(true);

    const response = await request(app)
      .delete("/api/machines/m1")
      .set("Authorization", bearer("user-1"));

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(repository.delete).toHaveBeenCalledWith("m1", "user-1");
  });

  it("returns 404 when there is no machine to delete for the authenticated user", async () => {
    repository.delete.mockResolvedValue(false);

    const response = await request(app)
      .delete("/api/machines/m1")
      .set("Authorization", bearer("user-2"));

    expect(response.status).toBe(404);
  });
});
