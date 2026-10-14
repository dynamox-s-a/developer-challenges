import type { MonitoringPoint } from "@full-stack-solution/shared";
import {
  BusinessRuleError,
  ConflictError,
  NotFoundError,
} from "../../shared/errors/app-error";
import type { MonitoringPointsRepository } from "./monitoring-points.repository";
import { MonitoringPointsService } from "./monitoring-points.service";

describe("MonitoringPointsService", () => {
  let repository: jest.Mocked<MonitoringPointsRepository>;
  let service: MonitoringPointsService;

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
    service = new MonitoringPointsService(repository);
  });

  describe("createForMachine", () => {
    it("throws NotFound when the machine is not the user's", async () => {
      repository.machineBelongsToUser.mockResolvedValue(false);

      await expect(
        service.createForMachine("m1", "u1", { name: "Mancal" }),
      ).rejects.toThrow(NotFoundError);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("creates the point for the user's machine", async () => {
      repository.machineBelongsToUser.mockResolvedValue(true);

      await service.createForMachine("m1", "u1", { name: "Mancal" });

      expect(repository.create).toHaveBeenCalledWith("u1", "m1", "Mancal");
    });
  });

  describe("assignSensor", () => {
    it("throws NotFound when the point is not the user's", async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(
        service.assignSensor("p1", "u1", { id: "S-1", model: "HF+" }),
      ).rejects.toThrow(NotFoundError);
    });

    it.each(["TcAg", "TcAs"] as const)(
      "rejects %s on a Pump and keeps the current sensor",
      async (model) => {
        repository.findOwned.mockResolvedValue({
          id: "p1",
          machineType: "Pump",
        });

        await expect(
          service.assignSensor("p1", "u1", { id: "S-1", model }),
        ).rejects.toThrow(BusinessRuleError);
        expect(repository.replaceSensor).not.toHaveBeenCalled();
      },
    );

    it("accepts HF+ on a Pump", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Pump" });

      await service.assignSensor("p1", "u1", { id: "S-1", model: "HF+" });

      expect(repository.replaceSensor).toHaveBeenCalledWith("p1", "u1", {
        id: "S-1",
        model: "HF+",
      });
    });

    it.each(["TcAg", "TcAs", "HF+"] as const)(
      "accepts %s on a Fan",
      async (model) => {
        repository.findOwned.mockResolvedValue({
          id: "p1",
          machineType: "Fan",
        });

        await service.assignSensor("p1", "u1", { id: "S-1", model });

        expect(repository.replaceSensor).toHaveBeenCalledTimes(1);
      },
    );

    it("lets a duplicated sensor ID surface as a conflict", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Fan" });
      repository.replaceSensor.mockRejectedValue(new ConflictError("in use"));

      await expect(
        service.assignSensor("p1", "u1", { id: "S-1", model: "TcAg" }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("removeSensor", () => {
    it("throws NotFound when the point has no sensor", async () => {
      repository.findOwned.mockResolvedValue({ id: "p1", machineType: "Fan" });
      repository.deleteSensor.mockResolvedValue(false);

      await expect(service.removeSensor("p1", "u1")).rejects.toThrow(
        NotFoundError,
      );
    });

    it("does not touch sensors of a point that is not the user's", async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(service.removeSensor("p1", "u1")).rejects.toThrow(
        NotFoundError,
      );
      expect(repository.deleteSensor).not.toHaveBeenCalled();
    });
  });

  describe("rename and remove", () => {
    it("renames only a point that belongs to the user", async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(service.rename("p1", "u1", { name: "X" })).rejects.toThrow(
        NotFoundError,
      );
      expect(repository.rename).not.toHaveBeenCalled();
    });

    it("throws NotFound when nothing was deleted", async () => {
      repository.delete.mockResolvedValue(false);

      await expect(service.remove("p1", "u1")).rejects.toThrow(NotFoundError);
    });
  });

  it("delegates the list to the repository with the user and the query", async () => {
    const page = {
      data: [] as MonitoringPoint[],
      page: 1,
      pageSize: 5,
      total: 0,
    };
    repository.list.mockResolvedValue(page);
    const query = {
      page: 1,
      pageSize: 5,
      sortBy: "name",
      order: "asc",
    } as const;

    await expect(service.list("u1", query)).resolves.toBe(page);
    expect(repository.list).toHaveBeenCalledWith("u1", query);
  });
});
