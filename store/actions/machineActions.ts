import { Machine } from "../machineTypes";

export const SET_MACHINES = "SET_MACHINES";
export const ADD_MACHINE = "ADD_MACHINE";

interface SetMachinesAction {
  type: typeof SET_MACHINES;
  payload: Machine[];
}

interface AddMachineAction {
  type: typeof ADD_MACHINE;
  payload: Machine;
}

export const setMachines = (machines: Machine[]): SetMachinesAction => ({
  type: SET_MACHINES,
  payload: machines,
});

export const addMachine = (machine: Machine): AddMachineAction => ({
  type: ADD_MACHINE,
  payload: machine,
});
