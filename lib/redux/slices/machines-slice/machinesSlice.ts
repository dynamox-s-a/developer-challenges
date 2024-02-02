import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createMachine, deleteMachine, getMachines, updateMachine } from "./thunks";

interface Machine {
  id: number;
  name: string;
  type: string;
  userId: number;
}

interface MachinesSliceState {
  data: Machine[];
  status: "iddle" | "loading" | "error";
}

const initialState: MachinesSliceState = {
  data: [],
  status: "loading",
};

export const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMachines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMachines.fulfilled, (state, action) => {
        state.status = "iddle";
        state.data = action.payload;
      })
      .addCase(createMachine.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        state.status = "iddle";
        const machineIndex = state.data.findIndex((machine) => machine.id === action.payload.id);
        state.data[machineIndex].id = action.payload.id;
        state.data[machineIndex].name = action.payload.name;
        state.data[machineIndex].type = action.payload.type;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.status = "iddle";
        const machineIndex = state.data.findIndex((machine) => machine.id === action.payload.id);
        state.data.splice(machineIndex, 1);
      });
  },
});
