import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { MachinesService } from "../../../../services/api/machines/MachinesSrevice";
import { FetchStatus } from "../../../types";
import { IMachinesState } from "../types";

let machineId: number;

export const deleteMachine = createAsyncThunk(
  "machines/deleteMachines",
  async (id: number) => {
    const response = await MachinesService.delete(id);
    machineId = id;
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
    .addCase(deleteMachine.fulfilled, (state) => {
      state.status = FetchStatus.succeeded;
      state.machines = state.machines.filter(
        (machine) => machine.id !== machineId,
      );
      state.total -= 1;
    })
    .addCase(deleteMachine.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
