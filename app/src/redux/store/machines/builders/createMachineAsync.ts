import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { MachinesService } from "../../../../services/api/machines/MachinesSrevice";
import { FetchStatus } from "../../../types";
import { IMachine, IMachinesState } from "../types";

export const createMachine = createAsyncThunk(
  "machines/createMachines",
  async (machine: IMachine) => {
    const response = await MachinesService.create(machine);
    return response.data;
  },
);

export const createMachineAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMachinesState>,
) => {
  builder
    .addCase(createMachine.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      createMachine.fulfilled,
      (state, { payload }: PayloadAction<IMachine>) => {
        state.status = FetchStatus.succeeded;
        state.machines.push(payload);
      },
    )
    .addCase(createMachine.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
