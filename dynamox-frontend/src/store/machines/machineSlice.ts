import { createSlice } from "@reduxjs/toolkit";
import { fetchMachines, createMachine } from "./machineThunks";
import { Machine } from "./machineTypes";
import { deleteMachine } from "./machineThunks";
import { updateMachine } from "./machineThunks";

interface MachineState {
  items: Machine[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
  selectedId: string | null;
}

const initialState: MachineState = {
  items: [],
  status: "idle",
  loading: false,
  error: null,
  selectedId: null,
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
        state.items = action.payload;
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
        state.items.push(action.payload);
      })
      .addCase(createMachine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((m) => m.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.items = state.items.filter((machine) => machine.id !== action.payload);
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default machineSlice.reducer;
