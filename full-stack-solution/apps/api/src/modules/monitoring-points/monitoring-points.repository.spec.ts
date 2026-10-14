import type { PrismaClient } from "../../generated/prisma/client";
import { ConflictError } from "../../shared/errors/app-error";
import { PrismaMonitoringPointsRepository } from "./monitoring-points.repository";

const asPrisma = (fake: unknown) => fake as PrismaClient;

describe("PrismaMonitoringPointsRepository", () => {
  describe("list", () => {
    const row = (sensorModel: "HF_PLUS" | null) => ({
      id: "p1",
      name: "Mancal",
      machine: { id: "m1", name: "Bomba 01", type: "Pump" },
      sensor: sensorModel ? { id: "S-1", model: sensorModel } : null,
    });

    const setup = (rows: unknown[] = [], total = 0) => {
      const prisma = {
        monitoringPoint: {
          findMany: jest.fn().mockReturnValue("findMany-call"),
          count: jest.fn().mockReturnValue("count-call"),
        },
        $transaction: jest.fn().mockResolvedValue([rows, total]),
      };
      return {
        prisma,
        repository: new PrismaMonitoringPointsRepository(asPrisma(prisma)),
      };
    };

    it("paginates, filters by user and maps rows without leaking HF_PLUS", async () => {
      const { prisma, repository } = setup([row("HF_PLUS"), row(null)], 12);

      const result = await repository.list("u1", {
        page: 3,
        pageSize: 5,
        sortBy: "machineType",
        order: "desc",
      });

      expect(prisma.monitoringPoint.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { createdById: "u1" },
          skip: 10,
          take: 5,
          orderBy: [{ machine: { type: "desc" } }, { id: "asc" }],
        }),
      );
      expect(result).toMatchObject({ page: 3, pageSize: 5, total: 12 });
      expect(result.data[0]).toMatchObject({
        machineName: "Bomba 01",
        machineType: "Pump",
        sensorId: "S-1",
        sensorModel: "HF+",
      });
      expect(result.data[1]).toMatchObject({
        sensorId: null,
        sensorModel: null,
      });
    });

    it.each([
      ["machineName", { machine: { name: "asc" } }],
      ["machineType", { machine: { type: "asc" } }],
      ["name", { name: "asc" }],
      ["sensorModel", { sensor: { model: "asc" } }],
    ] as const)(
      "sorts by %s, with an id tie-breaker",
      async (sortBy, expected) => {
        const { prisma, repository } = setup();

        await repository.list("u1", {
          page: 1,
          pageSize: 5,
          sortBy,
          order: "asc",
        });

        expect(prisma.monitoringPoint.findMany).toHaveBeenCalledWith(
          expect.objectContaining({ orderBy: [expected, { id: "asc" }] }),
        );
      },
    );
  });

  describe("replaceSensor", () => {
    const input = { id: "S-1", model: "HF+" } as const;

    const setup = () => {
      const tx = { sensor: { deleteMany: jest.fn(), create: jest.fn() } };
      const prisma = {
        $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
          callback(tx),
        ),
      };
      return {
        tx,
        repository: new PrismaMonitoringPointsRepository(asPrisma(prisma)),
      };
    };

    it("swaps the sensor in one transaction and stores HF+ as HF_PLUS", async () => {
      const { tx, repository } = setup();
      tx.sensor.create.mockResolvedValue({
        id: "S-1",
        model: "HF_PLUS",
        monitoringPointId: "p1",
      });

      const sensor = await repository.replaceSensor("p1", "u1", input);

      expect(tx.sensor.deleteMany).toHaveBeenCalledWith({
        where: { monitoringPointId: "p1" },
      });
      expect(tx.sensor.create).toHaveBeenCalledWith({
        data: {
          id: "S-1",
          model: "HF_PLUS",
          monitoringPointId: "p1",
          createdById: "u1",
        },
      });
      expect(sensor).toEqual({
        id: "S-1",
        model: "HF+",
        monitoringPointId: "p1",
      });
    });

    it("turns a unique violation into a ConflictError", async () => {
      const { tx, repository } = setup();
      tx.sensor.create.mockRejectedValue({ code: "P2002" });

      await expect(repository.replaceSensor("p1", "u1", input)).rejects.toThrow(
        ConflictError,
      );
    });

    it("rethrows any other error untouched", async () => {
      const { tx, repository } = setup();
      const failure = new Error("connection lost");
      tx.sensor.create.mockRejectedValue(failure);

      await expect(repository.replaceSensor("p1", "u1", input)).rejects.toBe(
        failure,
      );
    });
  });
});
