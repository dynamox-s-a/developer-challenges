import { MonitoringPoint } from "@/types/monitoringPoint";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MonitoringPointsState {
  monitoringPoints: MonitoringPoint[];
}

const initialState: MonitoringPointsState = {
  monitoringPoints: [],
};

const monitoringPointsSlice = createSlice({
  name: "monitoringPoints",
  initialState,
  reducers: {
    /**
     * Adds a new monitoring point to the state.
     * @param state - The current state of monitoring points.
     * @param action - The action containing the new monitoring point to add.
     */
    addMonitoringPoint: (state, action: PayloadAction<MonitoringPoint>) => {
      state.monitoringPoints.push(action.payload);
    },

    /**
     * Removes a monitoring point from the state by its ID.
     * @param state - The current state of monitoring points.
     * @param action - The action containing the ID of the monitoring point to remove.
     */
    removeMonitoringPoint: (state, action: PayloadAction<string>) => {
      state.monitoringPoints = state.monitoringPoints.filter(
        (mp) => mp.id !== action.payload,
      );
    },
  },
});

export const { addMonitoringPoint, removeMonitoringPoint } =
  monitoringPointsSlice.actions;
export default monitoringPointsSlice.reducer;
