import { createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "../../types";
import { createMonitoringPointAsyncBuilder } from "./builders/createMonitoringPointsAsync";
import { deleteMonitoringPointAsyncBuilder } from "./builders/deleteMonitoringPointsAsync";
import { getMonitoringPointsAsyncBuilder } from "./builders/getMonitoringPointsAsync";
import { updateMonitoringPointAsyncBuilder } from "./builders/updateMonitoringPointsAsync";
import { IMonitoringPointsState, Sensors } from "./types";

const initialMonitoringPoints: IMonitoringPointsState = {
  monitoringPoints: [],
  total: 0,
  sensors: [Sensors.tcAg, Sensors.tcAf, Sensors.hf],
  status: FetchStatus.idle,
  error: undefined,
};

const monitoringPointsSlice = createSlice({
  name: "monitoringPoints",
  initialState: initialMonitoringPoints,
  reducers: {},
  extraReducers(builder) {
    getMonitoringPointsAsyncBuilder(builder);
    createMonitoringPointAsyncBuilder(builder);
    updateMonitoringPointAsyncBuilder(builder);
    deleteMonitoringPointAsyncBuilder(builder);
  },
});

// export const getMonitoringPoints = (state: RootState) => state.monitoringPoints;
// export const getMonitoringPointStatus = (state: RootState) => state.user.status;
// export const getMonitoringPointError = (state: RootState) => state.user.error;
export default monitoringPointsSlice.reducer;
