import { createSlice, type UnknownAction } from "@reduxjs/toolkit";
import { createMachine, deleteMachine, updateMachine } from "../machines/machinesSlice";
import { attachSensor, createMonitoringPoint } from "../monitoring/monitoringSlice";
import { deleteTimeSeries, uploadTimeSeries } from "../time-series/timeSeriesSlice";

interface Notification {
  // Bumped per notification so the snackbar restarts its timer on back-to-back successes.
  key: number;
  message: string;
}

interface NotificationsState {
  current: Notification | null;
  sequence: number;
}

const initialState: NotificationsState = {
  current: null,
  sequence: 0,
};

// Single source of truth for success feedback: a fulfilled mutation is the only trigger, so no page
// wires a snackbar of its own. Reads are deliberately absent — they already render their own state.
const successMessages = new Map<string, string>([
  [createMachine.fulfilled.type, "Machine created"],
  [updateMachine.fulfilled.type, "Machine updated"],
  [deleteMachine.fulfilled.type, "Machine deleted"],
  [createMonitoringPoint.fulfilled.type, "Monitoring point created"],
  [attachSensor.fulfilled.type, "Sensor attached"],
  [uploadTimeSeries.fulfilled.type, "Time series uploaded"],
  [deleteTimeSeries.fulfilled.type, "Time series deleted"],
]);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    dismissNotification(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: UnknownAction) => successMessages.has(action.type),
      (state, action: UnknownAction) => {
        const message = successMessages.get(action.type);
        if (!message) {
          return;
        }
        state.sequence += 1;
        state.current = { key: state.sequence, message };
      }
    );
  },
});

export const { dismissNotification } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
