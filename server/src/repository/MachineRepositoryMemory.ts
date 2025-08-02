import { MachineDTO } from "../types/types.js";

export class MachineRepositoryMemory {
    private machines: MachineDTO[] = [];

    save(machine: MachineDTO): void {
        this.machines.push(machine);
    }

    getByUserId(userId: string): MachineDTO[] {
        return this.machines.filter(machine => machine.userId === userId);
    }

    getById(id: string): MachineDTO | null {
        return this.machines.find(machine => machine.id === id) || null;
    }

    delete(id: string): void {
        this.machines = this.machines.filter(machine => machine.id !== id);
    }

    // for testing purposes ONLY
    clear(): void {
        this.machines = [];
    }
}