import { createSlice } from "@reduxjs/toolkit";

interface IMonitoringPoint {
    _id: string;
    _userId: string;
    _machineId: string;
    _machineName: string;
    _machineType: string;
    name: string;
    sensorName: string;
}

const initialState: IMonitoringPoint[] = [];

//Reducer configuration
export const monitoringPointSlice = createSlice({
    name: "monitoringPoint",
    initialState: { value: initialState },
    reducers: {
        updateMonitoringPoint: (state, action) => {
            state.value = action.payload;
        }
    }
});

//Reducer actions
export const { updateMonitoringPoint } = monitoringPointSlice.actions;

export default monitoringPointSlice.reducer;