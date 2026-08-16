import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MachineInfo, RawSeries } from "./types";

export interface MachineDataState {
	machine: MachineInfo | null;
	readings: RawSeries[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: MachineDataState = {
	machine: null,
	readings: [],
	status: "idle",
	error: null,
};

const machineDataSlice = createSlice({
	name: "machineData",
	initialState,
	reducers: {
		fetchMachineData: (state) => {
			state.status = "loading";
			state.error = null;
		},
		fetchMachineDataSuccess: (
			state,
			action: PayloadAction<{ machine: MachineInfo; readings: RawSeries[] }>,
		) => {
			state.status = "succeeded";
			state.machine = action.payload.machine;
			state.readings = action.payload.readings;
		},
		fetchMachineDataFailure: (state, action: PayloadAction<string>) => {
			state.status = "failed";
			state.error = action.payload;
		},
	},
});

export const {
	fetchMachineData,
	fetchMachineDataSuccess,
	fetchMachineDataFailure,
} = machineDataSlice.actions;

export default machineDataSlice.reducer;
