import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { InitialMachineState, MachineState } from "@/app/types/machine";


const initialState: InitialMachineState = {
    items: [],
    isLoading: false
};
const machineSlice = createSlice({
    name: "machine",
    initialState,
    reducers: {
        setMachines: (state, { payload }: PayloadAction<{ items: MachineState[], isLoading: boolean }>) => {
            state.items = payload.items;
            state.isLoading = payload.isLoading;
        },
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        }
    }
});

export const { setMachines, setLoading } = machineSlice.actions;
export default machineSlice.reducer;