import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { MachinesService } from "../../../../services/api/machines/MachinesSrevice";
import { FetchStatus } from "../../../types";
import { IMachine, IMachinesState } from "../types";

export const deleteMachine = createAsyncThunk(
  "machines/deleteMachines",
  async (id: number) => {
    const response = await MachinesService.deleteById(id);
    return response.data;
  },
);

export const deleteMachineAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMachinesState>,
) => {
  builder
    .addCase(deleteMachine.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      deleteMachine.fulfilled,
      (state, { payload }: PayloadAction<IMachine>) => {
        state.status = FetchStatus.succeeded;
        state.machines.filter((machine) => machine.id !== payload.id);
      },
    )
    .addCase(deleteMachine.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
