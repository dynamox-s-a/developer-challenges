import { InitialSensorState, SensorState } from "@/app/types/sensor";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialSensorState = {
    sensorItems: [],
    sensorIsLoading: false,
    selectedSensorId: ""
}

const sensorSlice = createSlice({
    name: "sensor",
    initialState,
    reducers: {
        setSensor: (state, { payload }: PayloadAction<{ items: SensorState[], sensorIsLoading: boolean, selectedSensorId: string }>) => {
            state.sensorItems = payload.items;
            state.sensorIsLoading = payload.sensorIsLoading;
        },
        setSensorLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.sensorIsLoading = payload;
        },
        setSelectedSensorId: (state, { payload }: PayloadAction<string>) => {
            state.selectedSensorId = payload;
        }
    }
});

export const { setSensor, setSensorLoading, setSelectedSensorId } = sensorSlice.actions;
export default sensorSlice.reducer;