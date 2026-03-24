import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createMonitoringPoint, deleteMonitoringPoint, updateMonitoringPoint } from "../api/monitoringPoints";
import { fetchMachines } from "../api/machines";
import type { MonitoringPointRow } from "../api/monitoringPoints";
import type { Machine } from "../api/machines";

type State = {
  items: MonitoringPointRow[];
  machines: Machine[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  items: [],
  machines: [],
  loading: false,
  error: null,
};

export const loadMachinesForSelect = createAsyncThunk("monitoringPoints/loadMachines", async () => {
  const machines = await fetchMachines();
  return machines;
});

export const addMonitoringPoint = createAsyncThunk(
  "monitoringPoints/add",
  async (payload: { machineId: string; name: string; sensor: { uniqueId: string; model: "HF_plus" | "TcAg" | "TcAs" } }) => {
    return await createMonitoringPoint(payload);
  }
);

export const editMonitoringPoint = createAsyncThunk(
  "monitoringPoints/edit",
  async (args: { id: string; name?: string }) => {
    return await updateMonitoringPoint(args.id, { name: args.name });
  }
);

export const removeMonitoringPoint = createAsyncThunk("monitoringPoints/remove", async (id: string) => {
  await deleteMonitoringPoint(id);
  return id;
});

const slice = createSlice({
  name: "monitoringPointsCrud",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadMachinesForSelect.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loadMachinesForSelect.fulfilled, (s, a) => {
        s.loading = false;
        s.machines = a.payload;
      })
      .addCase(loadMachinesForSelect.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load machines";
      })
      .addCase(addMonitoringPoint.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(editMonitoringPoint.fulfilled, (s, a) => {
        const idx = s.items.findIndex((m) => m.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(removeMonitoringPoint.fulfilled, (s, a) => {
        s.items = s.items.filter((m) => m.id !== a.payload);
      });
  },
});

export default slice.reducer;
