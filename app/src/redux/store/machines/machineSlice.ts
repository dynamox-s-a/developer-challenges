import { createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "../../types";
import { RootState } from "..";
import { IMachinesState } from "./types";
import { getMachinesAsyncBuilder } from "./builders/getMachinesAsync";
import { createMachineAsyncBuilder } from "./builders/createMachineAsync";
import { updateMachineAsyncBuilder } from "./builders/updateMachineAsync";
import { deleteMachineAsyncBuilder } from "./builders/deleteMachineAsync";

const initialMachines: IMachinesState = {
  machines: [],
  status: FetchStatus.idle,
  error: undefined,
};

const machinesSlice = createSlice({
  name: "machines",
  initialState: initialMachines,
  reducers: {},
  extraReducers(builder) {
    getMachinesAsyncBuilder(builder);
    createMachineAsyncBuilder(builder);
    updateMachineAsyncBuilder(builder);
    deleteMachineAsyncBuilder(builder);
  },
});

export const getMachines = (state: RootState) => state.machine;
export const getMachineStatus = (state: RootState) => state.user.status;
export const getMachineError = (state: RootState) => state.user.error;
export default machinesSlice.reducer;
