import { type Machine } from "./Machine";

export type CreateMachineRequest = Omit<Machine, "id" | "MachineType">;
