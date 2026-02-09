import { MachineType } from "./enum"

export type MachineState = {
    id: string,
    name: string,
    type: MachineType | null,
    userId: string,
    createdAt: Date | null,
    updatedAt: Date | null
}

export type InitialMachineState = {
    items: MachineState[],
    isLoading: boolean,
};