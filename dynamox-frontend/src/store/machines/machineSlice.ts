import { createSlice } from "@reduxjs/toolkit";
import { fetchMachines, createMachine } from "./machineThunks";
import { Machine } from "./machineTypes";
import { deleteMachine } from "./machineThunks";
import { updateMachine } from "./machineThunks";

interface MachineState {
  machines: Machine[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
}

const initialState: MachineState = {
  machines: [],
  status: "idle",
  loading: false,
  error: null,
};

const machineSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.machines = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(createMachine.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.machines.push(action.payload);
      })
      .addCase(createMachine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.machines.findIndex((m) => m.id === updated.id);
        if (index !== -1) {
          state.machines[index] = updated;
        }
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.machines = state.machines.filter((machine) => machine.id !== action.payload);
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default machineSlice.reducer;
