import { createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "../../types";
import { createMonitoringPointAsyncBuilder } from "./builders/createMonitoringPointsAsync";
import { deleteMonitoringPointAsyncBuilder } from "./builders/deleteMonitoringPointsAsync";
import { getMonitoringPointsAsyncBuilder } from "./builders/getMonitoringPointsAsync";
import { updateMonitoringPointAsyncBuilder } from "./builders/updateMonitoringPointsAsync";
import { IMonitoringPointsState, Sensors } from "./types";
import { listPointsAsyncBuilder } from "./builders/listPointsAsync";

const initialMonitoringPoints: IMonitoringPointsState = {
  monitoringPoints: [],
  listPoints: [],
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
    listPointsAsyncBuilder(builder);
  },
});

export default monitoringPointsSlice.reducer;
