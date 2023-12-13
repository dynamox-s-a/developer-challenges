import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FetchStatus } from "../../../types";
import { MonitoringPointsService } from "../../../../services/api/monitoringPoints/MonitoringPointsService";
import { IListPoint, IMonitoringPointsState } from "../types";

export const getListPoints = createAsyncThunk(
  "machines/listPoints",
  async () => {
    const response = await MonitoringPointsService.list();
    return response.data;
  },
);

export const listPointsAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMonitoringPointsState>,
) => {
  builder
    .addCase(getListPoints.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      getListPoints.fulfilled,
      (state, { payload }: PayloadAction<IListPoint[]>) => {
        state.status = FetchStatus.succeeded;
        state.listPoints = payload;
      },
    )
    .addCase(getListPoints.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
