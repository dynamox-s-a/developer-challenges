import { MachineTypes } from "../../../types";
import { FetchStatus } from "../../types";

export interface IMachine {
  id: number;
  name: string;
  type: MachineTypes;
}

export interface IMachinesState {
  readonly machines: IMachine[];
  readonly status: FetchStatus;
  readonly error: string | undefined;
}
