import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FetchStatus } from "../../../types";
import {
  IMonitoringPoint,
  IMonitoringPointStore,
  IMonitoringPointsState,
} from "../types";
import { MonitoringPointsService } from "../../../../services/api/monitoringPoints/MonitoringPointsService";

export const updateMonitoringPoint = createAsyncThunk(
  "monitoringPoints/fetchMonitoringPoints",
  async (monitoringPoint: IMonitoringPoint) => {
    const response = await MonitoringPointsService.updateById(monitoringPoint);
    return response.data;
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
      (state, { payload }: PayloadAction<IMonitoringPointStore>) => {
        state.status = FetchStatus.succeeded;
        const { id, name, machineName, machineType, sensor } = payload;
        state.monitoringPoints
          .filter((point) => point.id === id)
          .map((point) => {
            point.name = name;
            point.machineName = machineName;
            point.machineType = machineType;
            point.sensor = sensor;
          });
      },
    )
    .addCase(updateMonitoringPoint.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
