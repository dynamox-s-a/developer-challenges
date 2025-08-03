import { describe, expect, test } from "vitest";
import { MachineRepositoryMemory } from "../../src/repository/MachineRepositoryMemory";
import { MachineFactory } from "../../src/domain/MachineFactory";
import { MachineDTO, MachineType } from "../../src/types/types";

describe("MachineRepository", () => {
    test("should save a machine", async () => {
        const repository = new MachineRepositoryMemory();
        const machine = MachineFactory.create("userId", "test", MachineType.PUMP);
        await repository.save(machine.toJSON() as MachineDTO);
        const machines = await repository.getByUserId("userId");
        expect(machines).toHaveLength(1);
        expect(machines[0]).toEqual(machine.toJSON());
    });

    test("should get a machine by user id", async () => {
        const repository = new MachineRepositoryMemory();
        const machine = MachineFactory.create("userId", "test", MachineType.PUMP);
        await repository.save(machine.toJSON() as MachineDTO);
        const machines = await repository.getByUserId("userId");
        expect(machines).toHaveLength(1);
        expect(machines[0]).toEqual(machine.toJSON());
    });

    test("should delete a machine", async () => {
        const repository = new MachineRepositoryMemory();
        const machine = MachineFactory.create("userId", "test", MachineType.PUMP);
        await repository.save(machine.toJSON() as MachineDTO);
        const machines = await repository.getByUserId("userId");
        expect(machines).toHaveLength(1);
        await repository.delete(machine.id);
        const machinesAfterDelete = await repository.getByUserId("userId");
        expect(machinesAfterDelete).toHaveLength(0);
        expect(await repository.getById(machine.id)).toBeNull();
    });
});

