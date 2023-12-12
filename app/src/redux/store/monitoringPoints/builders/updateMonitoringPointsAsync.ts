import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FetchStatus } from "../../../types";
import {
  EditPoint,
  IListPoint,
  IMonitoringPointsState,
} from "../types";
import { MonitoringPointsService } from "../../../../services/api/monitoringPoints/MonitoringPointsService";

export const updateMonitoringPoint = createAsyncThunk(
  "monitoringPoints/fetchMonitoringPoints",
  async (monitoringPoint: EditPoint) => {
    const response = await MonitoringPointsService.update(monitoringPoint);
    return response.data;

    console.log("RESPOSTA DO THUNK", response.data)
  },
);

export const updateMonitoringPointAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMonitoringPointsState>,
) => {
  builder
    .addCase(updateMonitoringPoint.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      updateMonitoringPoint.fulfilled,
      (state, { payload }: PayloadAction<IListPoint>) => {
        state.status = FetchStatus.succeeded;
        const { id, name, sensor } = payload;
        state.listPoints
          .filter((point) => point.id === id)
          .map((point) => {
            point.name = name;
            point.sensor = sensor;
          });
      },
    )
    .addCase(updateMonitoringPoint.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
