import { createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "../../types";
import { createMachineAsyncBuilder } from "./builders/createMachineAsync";
import { deleteMachineAsyncBuilder } from "./builders/deleteMachineAsync";
import { getMachinesAsyncBuilder } from "./builders/getMachinesAsync";
import { updateMachineAsyncBuilder } from "./builders/updateMachineAsync";
import { IMachinesState, MachineTypes } from "./types";

const initialMachines: IMachinesState = {
  machines: [],
  total: 0,
  types: [MachineTypes.pump, MachineTypes.fan],
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

export default machinesSlice.reducer;
