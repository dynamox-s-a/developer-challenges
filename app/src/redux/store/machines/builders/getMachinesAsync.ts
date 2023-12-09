import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { MachinesService } from "../../../../services/api/machines/MachinesSrevice";
import { FetchStatus } from "../../../types";
import { IMachine, IMachinesState } from "../types";

export const getMachines = createAsyncThunk(
  "machines/fetchMachines",
  async () => {
    const response = await MachinesService.getAll();
    return response.data;
  },
);

export const getMachinesAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMachinesState>,
) => {
  builder
    .addCase(getMachines.pending, (state, action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      getMachines.fulfilled,
      (state, { payload }: PayloadAction<IMachine[]>) => {
        state.status = FetchStatus.succeeded;
        state.machines = payload;
      },
    )
    .addCase(getMachines.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
