import { InitialMonitoringState, MonitoringPointType } from "@/app/types/monitoring";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialMonitoringState = {
    items: [],
    total: 0,
    isLoading: false
}

const monitoringSlice = createSlice({
    name: "monitoring",
    initialState,
    reducers: {
        setMonitoringPoints: (state, { payload }: PayloadAction<{ items: MonitoringPointType[], total: number }>) => {
            state.items = payload.items;
            state.total = payload.total;
            state.isLoading = false;
        },
        addMonitoringPoint: (state, { payload }: PayloadAction<MonitoringPointType>) => {
            state.items.unshift(payload);
            state.total += 1;
        },
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoading = true;
        }
    }
});

export const { setMonitoringPoints, addMonitoringPoint, setLoading } = monitoringSlice.actions;
export default monitoringSlice.reducer;