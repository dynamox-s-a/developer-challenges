import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SensorModel = 'TcAg' | 'TcAs' | 'HF+';

export interface MonitoringPoint {
    id: string;
    name: string;
    machineId: string;
    sensor?: {
        id: string;
        model: SensorModel;
    };
}

interface MonitoringState {
    list: MonitoringPoint[];
}

const initialState: MonitoringState = {
    list: [],
};

const monitoringSlice = createSlice({
    name: 'monitoring',
    initialState,
    reducers: {
        addMonitoringPoint: (state, action: PayloadAction<MonitoringPoint>) => {
        state.list.push(action.payload);
        },
        addSensorToPoint: (
        state,
        action: PayloadAction<{
            pointId: string;
            sensor: { id: string; model: SensorModel };
        }>
        ) => {
        const point = state.list.find(p => p.id === action.payload.pointId);
        if (point) {
            point.sensor = action.payload.sensor;
        }
        },
    },
});

export const { addMonitoringPoint, addSensorToPoint } = monitoringSlice.actions;
export default monitoringSlice.reducer;
