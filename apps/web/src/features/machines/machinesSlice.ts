import type { Machine, MachineType } from "@dyn/contracts";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/asyncThunk";

interface MachinesState {
  items: Machine[];
  status: "idle" | "loading" | "ready" | "failed";
  mutationStatus: "idle" | "submitting";
  error: string | null;
}

const initialState: MachinesState = {
  items: [],
  status: "idle",
  mutationStatus: "idle",
  error: null,
};

export const fetchMachines = createAppAsyncThunk<Machine[], void>(
  "machines/fetch",
  (_, { extra }) => extra.listMachines()
);

export const createMachine = createAppAsyncThunk<Machine, { name: string; type: MachineType }>(
  "machines/create",
  (input, { extra }) => extra.createMachine(input)
);

export const updateMachine = createAppAsyncThunk<
  Machine,
  { id: string; name: string; type: MachineType }
>("machines/update", ({ id, name, type }, { extra }) => extra.updateMachine(id, { name, type }));

export const deleteMachine = createAppAsyncThunk<string, string>(
  "machines/delete",
  async (id, { extra }) => {
    await extra.deleteMachine(id);
    return id;
  }
);

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    clearMachineError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load machines.";
      })
      .addCase(createMachine.pending, beginMutation)
      .addCase(createMachine.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        state.items.push(action.payload);
      })
      .addCase(createMachine.rejected, failMutation)
      .addCase(updateMachine.pending, beginMutation)
      .addCase(updateMachine.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMachine.rejected, failMutation)
      .addCase(deleteMachine.pending, beginMutation)
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMachine.rejected, failMutation);
  },
});

function beginMutation(state: MachinesState) {
  state.mutationStatus = "submitting";
  state.error = null;
}

function failMutation(state: MachinesState, action: { error: { message?: string | undefined } }) {
  state.mutationStatus = "idle";
  state.error = action.error.message ?? "The operation failed.";
}

export const { clearMachineError } = machinesSlice.actions;
export const machinesReducer = machinesSlice.reducer;
