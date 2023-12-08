import { MachineTypes } from "../../../types";

export interface IMachine {
  id: number;
  name: string;
  type: MachineTypes;
}

export interface IMachinesState {
  readonly machines: IMachine[];
  readonly loading: boolean;
  readonly error: boolean;
}
