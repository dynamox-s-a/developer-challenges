import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface MonitoringPoint {
    id: string;        
    machineId: string;
    name: string;
    sensorModel: "TcAg" | "TcAs" | "HF+"; 
}

interface MonitoringPointsState {
    list: MonitoringPoint[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MonitoringPointsState = {
    list: [],
    status: "idle",
    error: null
}

export const fetchMonitoringPoints = createAsyncThunk(
    'monitoringPoints/fetchMonitoringPoints', 
    async () => {
        const response = await axios.get('http://localhost:3000/monitoringPoints');
        return response.data;
    }
);

export const addMonitoringPoint = createAsyncThunk(
    'monitoringPoints/addMonitoringPoint',
    async (newMonitoringPoint: Omit<MonitoringPoint, 'id'>) => {
        const response = await axios.post('http://localhost:3000/monitoringPoints', newMonitoringPoint);
        return response.data;
    }
);

const monitoringPointsSlice = createSlice({
    name: 'monitoringPoints',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonitoringPoints.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchMonitoringPoints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch monitoring points';
            })
            .addCase(addMonitoringPoint.fulfilled, (state, action) => {
                state.list.push(action.payload);
            }); 
    }
});

export default monitoringPointsSlice.reducer;