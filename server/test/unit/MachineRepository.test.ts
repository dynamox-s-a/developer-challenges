import { describe, expect, test } from "vitest";
import { MachineRepositoryMemory } from "../../src/repository/MachineRepositoryMemory";
import { MachineFactory } from "../../src/domain/MachineFactory";
import { MachineDTO, MachineType } from "../../src/types/types";

describe("MachineRepository", () => {
    test("should save a machine", () => {
        const repository = new MachineRepositoryMemory();
        const machine = MachineFactory.create("test", "test", MachineType.PUMP);
        repository.save(machine.toJSON() as MachineDTO);
        expect(repository.getByUserId("test")).toHaveLength(1);
        expect(repository.getById(machine.id)).toEqual(machine.toJSON());
    });

    test("should get a machine by user id", () => {
        const repository = new MachineRepositoryMemory();
        const machine = MachineFactory.create("test", "test", MachineType.PUMP);
        repository.save(machine.toJSON() as MachineDTO);
        expect(repository.getByUserId("test")).toHaveLength(1);
        expect(repository.getById(machine.id)).toEqual(machine.toJSON());
    });

    test("should delete a machine", () => {
        const repository = new MachineRepositoryMemory();
        const machine = MachineFactory.create("test", "test", MachineType.PUMP);
        repository.save(machine.toJSON() as MachineDTO);
        expect(repository.getByUserId("test")).toHaveLength(1);
        repository.delete(machine.id);
        expect(repository.getByUserId("test")).toHaveLength(0);
        expect(repository.getById(machine.id)).toBeNull();
    });
});

