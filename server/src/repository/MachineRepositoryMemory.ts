import { MachineDTO, MonitoringPointDTO } from "../types/types.js";

export class MachineRepositoryMemory {
    private machines: MachineDTO[] = [];

    async save(machine: MachineDTO): Promise<string> {
        this.machines.push(machine);
        return machine.id;
    }

    async getByUserId(userId: string): Promise<MachineDTO[]> {
        return this.machines.filter(machine => machine.userId === userId);
    }

    async getById(id: string): Promise<MachineDTO | null> {
        return this.machines.find(machine => machine.id === id) || null;
    }

    async delete(id: string): Promise<void> {
        this.machines = this.machines.filter(machine => machine.id !== id);
    }

    // for testing purposes ONLY
    async clear(): Promise<void> {
        this.machines = [];
    }
}