import { MachineType } from "./types.js";
import { BaseMachine } from "./BaseMachine.js";
import { PumpMachine } from "./PumpMachine.js";
import { FanMachine } from "./FanMachine.js";

export class MachineFactory {
    private static readonly machineCreators: Record<MachineType, (userId: string, name: string, type: MachineType) => BaseMachine> = {
        [MachineType.PUMP]: (userId: string, name: string, type: MachineType) => PumpMachine.create(userId, name, type),
        [MachineType.FAN]: (userId: string, name: string, type: MachineType) => FanMachine.create(userId, name, type),
    };

    private constructor() {
        // Prevent instantiation
    }

    static create(userId: string, name: string, type: MachineType): BaseMachine {
        if (!name || name.trim() === "") {
            throw new Error("Machine name cannot be empty");
        }

        const creator = this.machineCreators[type];
        if (!creator) {
            throw new Error(`Invalid machine type: ${type}. Supported types: ${Object.values(MachineType).join(", ")}`);
        }

        return creator(userId, name.trim(), type);
    }

    static getSupportedTypes(): MachineType[] {
        return Object.values(MachineType);
    }
} 