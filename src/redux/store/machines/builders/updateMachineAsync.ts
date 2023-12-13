import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { MachinesService } from "../../../../services/api/machines/MachinesSrevice";
import { FetchStatus } from "../../../types";
import { IMachine, IMachinesState } from "../types";

export const updateMachine = createAsyncThunk(
  "machines/updateMachines",
  async (machine: IMachine) => {
    const response = await MachinesService.update(machine);
    return response.data;
  },
);

export const updateMachineAsyncBuilder = (
  builder: ActionReducerMapBuilder<IMachinesState>,
) => {
  builder
    .addCase(updateMachine.pending, (state, _action) => {
      state.status = FetchStatus.loading;
    })
    .addCase(
      updateMachine.fulfilled,
      (state, { payload }: PayloadAction<IMachine>) => {
        state.status = FetchStatus.succeeded;
        const { id, name, type } = payload;
        state.machines
          .filter((machine) => machine.id === id)
          .map((machine) => {
            machine.name = name;
            machine.type = type;
          });
      },
    )
    .addCase(updateMachine.rejected, (state, { error }) => {
      state.status = FetchStatus.failed;
      state.error = error.message;
    });
};
