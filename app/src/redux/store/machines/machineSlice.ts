import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "../../types";
import { IMachine, IMachinesState } from "./types";
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

export const getMachines = (state: { machine: IMachine }) => state.machine;

export default machinesSlice.reducer;
