import { SensorData, SensorDataState } from "@/app/types/sensorData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SensorDataState = {
    items: [],
    isLoading: false
}

export const sensorDataSlice = createSlice({
    name: "sensorData",
    initialState,
    reducers: {
        setSensorsData: (state, { payload }: PayloadAction<{ items: SensorData[], isLoading: boolean }>) => {
            state.items = payload.items,
            state.isLoading = payload.isLoading
        },
        setSensorDataLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        }
    }
});

export const { setSensorsData, setSensorDataLoading } = sensorDataSlice.actions;
export default sensorDataSlice.reducer;