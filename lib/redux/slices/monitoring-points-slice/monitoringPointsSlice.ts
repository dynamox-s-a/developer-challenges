import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createMonitoringPoint, getMonitoringPoints } from "./thunks";

interface Machine {
  id: number;
  name: string;
  type: string;
  userId: number;
}

interface Sensor {
  id: number;
  model: string;
}

interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  sensorId: number;
  machine: Machine;
  sensor: Sensor;
}

interface MonitoringPointsSliceState {
  data: MonitoringPoint[];
  status: "iddle" | "loading" | "error";
}

const initialState: MonitoringPointsSliceState = {
  data: [],
  status: "loading",
};

export const monitoringPointsSlice = createSlice({
  name: "monitoringPoints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMonitoringPoints.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMonitoringPoints.fulfilled, (state, action) => {
        state.status = "iddle";
        state.data = action.payload;
      })
      .addCase(createMonitoringPoint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMonitoringPoint.fulfilled, (state, action) => {
        state.status = "iddle";
        state.data.push(action.payload);
      });
  },
});
