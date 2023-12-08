import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMachine, IMachinesState } from "./types";

const initialMachines: IMachinesState = {
  machines: [],
  error: false,
  loading: false,
};

const machinesSlice = createSlice({
  name: "machines",
  initialState: initialMachines,
  reducers: {
    setMachines: (state, { payload }: PayloadAction<IMachine[]>) => {
      return { ...state, machines: payload };
    },
    createMachine: (state, { payload }: PayloadAction<IMachine>) => {
      return { ...state, machines: [...state.machines, payload] };
    },
    updateMachine: (state, { payload }: PayloadAction<IMachine>) => {
      const { id, name, type } = payload;
      state.machines
        .filter((machine) => machine.id === id)
        .map((machine) => {
          machine.name = name;
          machine.type = type;
        });
    },
    deleteMachine: (state, { payload }: PayloadAction<IMachine>) => {
      state.machines.filter((machine) => machine.id !== payload.id);
    },
  },
});

export const { setMachines, createMachine, updateMachine, deleteMachine } =
  machinesSlice.actions;

export const getMachines = (state: { machine: IMachine }) => state.machine;

export default machinesSlice.reducer;
