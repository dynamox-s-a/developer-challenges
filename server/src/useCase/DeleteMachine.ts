import { MachineFactory } from "../domain/MachineFactory.js";
import { MachineRepositoryMemory } from "../repository/MachineRepositoryMemory.js";
import { MonitoringPointRepositoryMemory } from "../repository/MonitoringPointRepositoryMemory.js";
import { MachineType } from "../types/types.js";

export default class DeleteMachine {
    private machineRepository: MachineRepositoryMemory;
    private monitoringPointRepository: MonitoringPointRepositoryMemory;

    constructor(machineRepository: MachineRepositoryMemory, monitoringPointRepository: MonitoringPointRepositoryMemory) {
        this.machineRepository = machineRepository;
        this.monitoringPointRepository = monitoringPointRepository;
    }

    async execute(userId: string, id: string): Promise<void> {
        const machines = await this.machineRepository.getByUserId(userId);
        const machine = machines.find(m => m.id === id);
        if (!machine) {
            throw new Error("Machine not found");
        }
        await this.machineRepository.delete(id);
        await this.monitoringPointRepository.deleteByMachineId(id);
    }
}