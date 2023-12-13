import { FetchStatus } from "../../types";

export enum MachineTypes {
  pump = "Pump",
  fan = "Fan",
}
export interface IMachine {
  id: number;
  name: string;
  type: MachineTypes;
}

export interface IPagination {
  page: number;
  limit: number;
}

export type NewMachine = Omit<IMachine, "id">;

export interface IMachinesState {
  readonly machines: IMachine[];
  readonly total: number;
  readonly types: MachineTypes[];
  readonly status: FetchStatus;
  readonly error: string | undefined;
}
