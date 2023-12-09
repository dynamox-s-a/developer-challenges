import { createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "../../types";
import { RootState } from "..";
import { IMonitoringPointsState } from "./types";
import { getMonitoringPointsAsyncBuilder } from "./builders/getMonitoringPointsAsync";
import { createMonitoringPointAsyncBuilder } from "./builders/createMonitoringPointsAsync";
import { updateMonitoringPointAsyncBuilder } from "./builders/updateMonitoringPointsAsync";
import { deleteMonitoringPointAsyncBuilder } from "./builders/deleteMonitoringPointsAsync";

const initialMonitoringPoints: IMonitoringPointsState = {
  monitoringPoints: [],
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

export const getMonitoringPoints = (state: RootState) => state.monitoringPoint;
export const getMonitoringPointStatus = (state: RootState) => state.user.status;
export const getMonitoringPointError = (state: RootState) => state.user.error;
export default monitoringPointsSlice.reducer;
