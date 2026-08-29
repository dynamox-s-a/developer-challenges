import type {
  MonitoringPoint,
  MonitoringPointListResponse,
  Sensor,
  SensorModel,
} from "@dyn/contracts";
import { createSlice } from "@reduxjs/toolkit";
import type { MonitoringPointQuery } from "../../api/client";
import { createAppAsyncThunk } from "../../app/asyncThunk";
import { deleteMachine, updateMachine } from "../machines/machinesSlice";

interface MonitoringState {
  result: MonitoringPointListResponse | null;
  machinePoints: MonitoringPoint[];
  // Every point of every known machine, used to label ids with human-readable names.
  directory: MonitoringPoint[];
  status: "idle" | "loading" | "ready" | "failed";
  machinePointsStatus: "idle" | "loading" | "ready" | "failed";
  directoryStatus: "idle" | "loading" | "ready" | "failed";
  mutationStatus: "idle" | "submitting";
  listRequestId: string | null;
  machinePointsMachineId: string | null;
  directoryRequestId: string | null;
  error: string | null;
  directoryError: string | null;
}

const initialState: MonitoringState = {
  result: null,
  machinePoints: [],
  directory: [],
  status: "idle",
  machinePointsStatus: "idle",
  directoryStatus: "idle",
  mutationStatus: "idle",
  listRequestId: null,
  machinePointsMachineId: null,
  directoryRequestId: null,
  error: null,
  directoryError: null,
};

export const fetchMonitoringPoints = createAppAsyncThunk<
  MonitoringPointListResponse,
  MonitoringPointQuery
>("monitoring/fetch", (query, { extra }) => extra.listMonitoringPoints(query));

export const fetchMachinePoints = createAppAsyncThunk<MonitoringPoint[], string>(
  "monitoring/fetchForMachine",
  (machineId, { extra }) => extra.listMachineMonitoringPoints(machineId)
);

// Fans the per-machine endpoint out in parallel: the paginated list endpoint is capped at 5 items
// per page, so it would need more round trips than there are machines.
export const fetchMonitoringPointDirectory = createAppAsyncThunk<MonitoringPoint[], string[]>(
  "monitoring/fetchDirectory",
  async (machineIds, { extra }) => {
    const pages = await Promise.all(
      machineIds.map((machineId) => extra.listMachineMonitoringPoints(machineId))
    );
    return pages.flat();
  }
);

export const createMonitoringPoint = createAppAsyncThunk<
  MonitoringPoint,
  { machineId: string; name: string }
>("monitoring/create", ({ machineId, name }, { extra }) =>
  extra.createMonitoringPoint(machineId, { name })
);

export const attachSensor = createAppAsyncThunk<
  Sensor,
  { monitoringPointId: string; sensorId: string; model: SensorModel }
>("monitoring/attachSensor", ({ monitoringPointId, sensorId, model }, { extra }) =>
  extra.attachSensor(monitoringPointId, { sensorId, model })
);

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {
    clearMonitoringError(state) {
      state.error = null;
    },
    clearMachinePoints(state) {
      state.machinePoints = [];
      state.machinePointsStatus = "idle";
      state.machinePointsMachineId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state, action) => {
        state.status = "loading";
        state.listRequestId = action.meta.requestId;
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return;
        }
        state.status = "ready";
        state.listRequestId = null;
        state.result = action.payload;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return;
        }
        state.status = "failed";
        state.listRequestId = null;
        state.error = action.error.message ?? "Unable to load monitoring points.";
      })
      .addCase(fetchMachinePoints.pending, (state, action) => {
        state.machinePointsStatus = "loading";
        state.machinePointsMachineId = action.meta.arg;
      })
      .addCase(fetchMachinePoints.fulfilled, (state, action) => {
        if (state.machinePointsMachineId !== action.meta.arg) {
          return;
        }
        state.machinePointsStatus = "ready";
        state.machinePoints = action.payload;
      })
      .addCase(fetchMachinePoints.rejected, (state, action) => {
        if (state.machinePointsMachineId !== action.meta.arg) {
          return;
        }
        state.machinePointsStatus = "failed";
        state.error = action.error.message ?? "Unable to load monitoring points.";
      })
      .addCase(fetchMonitoringPointDirectory.pending, (state, action) => {
        state.directoryStatus = "loading";
        state.directoryRequestId = action.meta.requestId;
        state.directoryError = null;
      })
      .addCase(fetchMonitoringPointDirectory.fulfilled, (state, action) => {
        if (state.directoryRequestId !== action.meta.requestId) {
          return;
        }
        state.directoryStatus = "ready";
        state.directoryRequestId = null;
        state.directory = action.payload;
      })
      .addCase(fetchMonitoringPointDirectory.rejected, (state, action) => {
        if (state.directoryRequestId !== action.meta.requestId) {
          return;
        }
        state.directoryStatus = "failed";
        state.directoryRequestId = null;
        state.directoryError = action.error.message ?? "Unable to load monitoring points.";
      })
      .addCase(createMonitoringPoint.pending, beginMutation)
      .addCase(createMonitoringPoint.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        // Ownership, not emptiness, decides the append: a machine whose first point is being created
        // has a loaded-but-empty list, and it still has to show the new point.
        if (
          state.machinePointsStatus === "ready" &&
          state.machinePointsMachineId === action.meta.arg.machineId
        ) {
          state.machinePoints.push(action.payload);
        }
        if (state.directoryStatus === "ready") {
          state.directory.push(action.payload);
        }
      })
      .addCase(createMonitoringPoint.rejected, failMutation)
      .addCase(attachSensor.pending, beginMutation)
      .addCase(attachSensor.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const sensor = action.payload;
        const listItem = state.result?.items.find((item) => item.id === sensor.monitoringPointId);
        if (listItem) {
          listItem.sensorId = sensor.id;
          listItem.sensorModel = sensor.model;
        }
        const point = state.machinePoints.find((item) => item.id === sensor.monitoringPointId);
        if (point) {
          point.sensor = sensor;
        }
        const known = state.directory.find((item) => item.id === sensor.monitoringPointId);
        if (known) {
          known.sensor = sensor;
        }
      })
      .addCase(attachSensor.rejected, failMutation)
      // Cross-slice invalidation: deleting a machine cascades to its points server-side, so every
      // cached projection of them is dropped here instead of waiting for the next refetch.
      .addCase(deleteMachine.fulfilled, (state, action) => {
        const machineId = action.payload;
        if (state.result) {
          const items = state.result.items.filter((item) => item.machineId !== machineId);
          const removed = state.result.items.length - items.length;
          state.result.items = items;
          state.result.total = Math.max(0, state.result.total - removed);
          state.result.totalPages = Math.ceil(state.result.total / state.result.pageSize);
        }
        state.directory = state.directory.filter((point) => point.machineId !== machineId);
        if (state.machinePointsMachineId === machineId) {
          state.machinePoints = [];
          state.machinePointsStatus = "idle";
          state.machinePointsMachineId = null;
        }
      })
      // The paginated rows denormalize the machine, so a renamed or retyped machine has to be
      // written through to them.
      .addCase(updateMachine.fulfilled, (state, action) => {
        const machine = action.payload;
        for (const item of state.result?.items ?? []) {
          if (item.machineId === machine.id) {
            item.machineName = machine.name;
            item.machineType = machine.type;
          }
        }
      });
  },
});

function beginMutation(state: MonitoringState) {
  state.mutationStatus = "submitting";
  state.error = null;
}

function failMutation(state: MonitoringState, action: { error: { message?: string | undefined } }) {
  state.mutationStatus = "idle";
  state.error = action.error.message ?? "The operation failed.";
}

export const { clearMonitoringError, clearMachinePoints } = monitoringSlice.actions;
export const monitoringReducer = monitoringSlice.reducer;
