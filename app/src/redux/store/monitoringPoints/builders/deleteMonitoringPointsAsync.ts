import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FetchStatus } from "../../../types";
import { IMonitoringPointStore, IMonitoringPointsState } from "../types";
import { MonitoringPointsService } from "../../../../services/api/monitoringPoints/MonitoringPointsService";

let pointId: number;

export const deleteMonitoringPoint = createAsyncThunk(
  "monitoringPoints/deleteMonitoringPoints",
  async (id: number) => {
    const response = await MonitoringPointsService.delete(id);
    pointId = id;
    return response.data;
  },
);

export const deleteMonitoringPointAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMonitoringPointsState>,
) => {
  builder
    .addCase(deleteMonitoringPoint.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      deleteMonitoringPoint.fulfilled,
      (state, { payload }: PayloadAction<IMonitoringPointStore>) => {
        state.status = FetchStatus.succeeded;
        state.monitoringPoints = state.monitoringPoints.filter(
          (point) => point.id !== payload.id,
        );
        state.total -= 1;
      },
    )
    .addCase(deleteMonitoringPoint.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
