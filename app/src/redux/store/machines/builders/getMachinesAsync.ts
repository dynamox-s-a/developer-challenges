import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { MachinesService } from "../../../../services/api/machines/MachinesSrevice";
import { IPagination } from "../../../../types";
import { FetchStatus } from "../../../types";
import { IMachine, IMachinesState } from "../types";

let count = 0;

export const getMachines = createAsyncThunk(
  "machines/getMachines",
  async (pagination: IPagination) => {
    const response = await MachinesService.getAll(pagination);
    count = response.headers["x-total-count"];
    return response.data;
  },
);

export const getMachinesAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMachinesState>,
) => {
  builder
    .addCase(getMachines.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      getMachines.fulfilled,
      (state, { payload }: PayloadAction<IMachine[]>) => {
        state.total = count;
        state.status = FetchStatus.succeeded;
        state.machines = payload;
      },
    )
    .addCase(getMachines.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
