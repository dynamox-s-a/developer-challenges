import { createSlice } from "@reduxjs/toolkit";

interface IMachines {
    name: string;
    type: string;
    _userId: string;
    _id: string;
}

const initialState: IMachines[] = [];

//Reducer configuration
export const machineSlice = createSlice({
    name: "machine",
    initialState: { value: initialState },
    reducers: {
        updateMachine: (state, action) => {
            state.value = action.payload;
        }
    }
});

//Reducer actions
export const { updateMachine } = machineSlice.actions;

export default machineSlice.reducer;