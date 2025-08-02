import { MachineFactory } from "../domain/MachineFactory.js";
import { MachineRepositoryMemory } from "../repository/MachineRepositoryMemory.js";
import { MachineType } from "../types/types.js";

export default class SaveNewMachine {
    private machineRepository: MachineRepositoryMemory;

    constructor(machineRepository: MachineRepositoryMemory) {
        this.machineRepository = machineRepository;
    }

    async execute(userId: string, name: string, type: MachineType): Promise<string> {
        const machine = MachineFactory.create(userId, name, type);
        const machineId = await this.machineRepository.save(machine.toJSON());
        return machineId;
    }
}