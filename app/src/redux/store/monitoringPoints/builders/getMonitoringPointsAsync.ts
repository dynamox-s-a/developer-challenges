import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FetchStatus } from "../../../types";
import { MonitoringPointsService } from "../../../../services/api/monitoringPoints/MonitoringPointsService";
import { IMonitoringPointStore, IMonitoringPointsState } from "../types";

export const getMonitoringPoints = createAsyncThunk(
  "machines/getMonitoringPoints",
  async () => {
    const response = await MonitoringPointsService.getAll();
    return response.data;
  },
);

export const getMonitoringPointsAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMonitoringPointsState>,
) => {
  builder
    .addCase(getMonitoringPoints.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      getMonitoringPoints.fulfilled,
      (state, { payload }: PayloadAction<IMonitoringPointStore[]>) => {
        state.status = FetchStatus.succeeded;
        state.monitoringPoints = payload;
      },
    )
    .addCase(getMonitoringPoints.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
