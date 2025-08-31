import { type Machine } from "./Machine";

export type MachineResponse = Omit<Machine, "machineTypeId">;