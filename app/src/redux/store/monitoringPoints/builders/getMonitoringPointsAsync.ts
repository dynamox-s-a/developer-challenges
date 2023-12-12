import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FetchStatus } from "../../../types";
import { MonitoringPointsService } from "../../../../services/api/monitoringPoints/MonitoringPointsService";
import { IMonitoringPoint, IMonitoringPointsState } from "../types";

let count = 0;

export const getMonitoringPoints = createAsyncThunk(
  "machines/getMonitoringPoints",
  async () => {
    const response = await MonitoringPointsService.getAll();
    count = response.headers["x-total-count"];
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
      (state, { payload }: PayloadAction<IMonitoringPoint[]>) => {
        state.total = count;
        state.status = FetchStatus.succeeded;
        state.monitoringPoints = payload;
      },
    )
    .addCase(getMonitoringPoints.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
