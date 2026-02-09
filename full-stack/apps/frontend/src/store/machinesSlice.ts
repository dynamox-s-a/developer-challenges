import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createMachine, deleteMachine, fetchMachines, updateMachine } from "../api/machines";
import type { Machine } from "../api/machines";

type State = {
  items: Machine[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  items: [],
  loading: false,
  error: null,
};

export const loadMachines = createAsyncThunk("machines/load", async () => {
  return await fetchMachines();
});

export const addMachine = createAsyncThunk(
  "machines/add",
  async (payload: { name: string; type: "Pump" | "Fan" }) => {
    return await createMachine(payload);
  }
);

export const editMachine = createAsyncThunk(
  "machines/edit",
  async (args: { id: string; name?: string; type?: "Pump" | "Fan" }) => {
    return await updateMachine(args.id, { name: args.name, type: args.type });
  }
);

export const removeMachine = createAsyncThunk("machines/remove", async (id: string) => {
  await deleteMachine(id);
  return id;
});

const slice = createSlice({
  name: "machines",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadMachines.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loadMachines.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(loadMachines.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load machines";
      })
      .addCase(addMachine.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(editMachine.fulfilled, (s, a) => {
        const idx = s.items.findIndex((m) => m.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(removeMachine.fulfilled, (s, a) => {
        s.items = s.items.filter((m) => m.id !== a.payload);
      });
  },
});

export default slice.reducer;
