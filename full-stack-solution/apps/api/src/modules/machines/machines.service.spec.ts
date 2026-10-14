import type { Machine } from "@full-stack-solution/shared";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error";
import type { MachinesRepository } from "./machines.repository";
import { MachinesService } from "./machines.service";

const machine = (overrides: Partial<Machine> = {}): Machine => ({
  id: "m1",
  name: "Fan 01",
  type: "Fan",
  monitoringPointsCount: 0,
  ...overrides,
});

describe("MachinesService", () => {
  let repository: jest.Mocked<MachinesRepository>;
  let service: MachinesService;

  beforeEach(() => {
    repository = {
      findAllByUser: jest.fn(),
      findOwned: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      hasSensorsBlockedForPump: jest.fn(),
    };
    service = new MachinesService(repository);
  });

  it("lists only the machines of the given user", async () => {
    repository.findAllByUser.mockResolvedValue([machine()]);

    await expect(service.list("u1")).resolves.toEqual([machine()]);
    expect(repository.findAllByUser).toHaveBeenCalledWith("u1");
  });

  it("creates a machine for the given user", async () => {
    repository.create.mockResolvedValue(machine());

    await service.create("u1", { name: "Fan 01", type: "Fan" });

    expect(repository.create).toHaveBeenCalledWith("u1", {
      name: "Fan 01",
      type: "Fan",
    });
  });

  describe("update", () => {
    it("throws NotFound when the machine is not the user's", async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(service.update("m1", "u1", { name: "X" })).rejects.toThrow(
        NotFoundError,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it("rejects Fan -> Pump when TcAg/TcAs sensors are installed", async () => {
      repository.findOwned.mockResolvedValue(machine({ type: "Fan" }));
      repository.hasSensorsBlockedForPump.mockResolvedValue(true);

      await expect(
        service.update("m1", "u1", { type: "Pump" }),
      ).rejects.toThrow(ConflictError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it("allows Fan -> Pump when no incompatible sensor is installed", async () => {
      repository.findOwned.mockResolvedValue(machine({ type: "Fan" }));
      repository.hasSensorsBlockedForPump.mockResolvedValue(false);
      repository.update.mockResolvedValue(machine({ type: "Pump" }));

      await expect(
        service.update("m1", "u1", { type: "Pump" }),
      ).resolves.toEqual(machine({ type: "Pump" }));
    });

    it.each([
      ["only the name changes", "Fan", { name: "New name" }],
      ["the machine is already a Pump", "Pump", { type: "Pump" }],
      ["the type changes to Fan", "Pump", { type: "Fan" }],
    ] as const)(
      "does not look for sensors when %s",
      async (_label, currentType, input) => {
        repository.findOwned.mockResolvedValue(machine({ type: currentType }));
        repository.update.mockResolvedValue(machine());

        await service.update("m1", "u1", input);

        expect(repository.hasSensorsBlockedForPump).not.toHaveBeenCalled();
        expect(repository.update).toHaveBeenCalledWith("m1", input);
      },
    );
  });

  describe("remove", () => {
    it("throws NotFound when nothing was deleted", async () => {
      repository.delete.mockResolvedValue(false);
      await expect(service.remove("m1", "u1")).rejects.toThrow(NotFoundError);
    });

    it("resolves when the machine was deleted", async () => {
      repository.delete.mockResolvedValue(true);
      await expect(service.remove("m1", "u1")).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith("m1", "u1");
    });
  });
});
