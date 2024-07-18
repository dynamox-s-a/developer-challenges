// redux/monitoringPointsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import {api} from "@/src/utils/apiClient";

export interface MonitoringPoint {
    id: string;
    machineId: string;
    machineName: string;
    machineType: string;
    pointName: string;
    sensorModel: string;
}

interface MonitoringPointsState {
    points: MonitoringPoint[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MonitoringPointsState = {
    points: [],
    status: 'idle',
    error: null,
};

export const fetchMonitoringPoints = createAsyncThunk(
    'monitoringPoints/fetchMonitoringPoints',
    async (page: string) => {
        const response = await api.get('/monitoring-points', {
            params: {
                page
            }
        });
        return response.data;
    }
);

export const createMonitoringPoint = createAsyncThunk(
    'monitoringPoints/createMonitoringPoint',
    async (newPoint: MonitoringPoint) => {
        const response = await api.post('/monitoring-points', newPoint);
        return response.data; // Se o servidor retornar os dados atualizados do ponto de monitoramento
    }
);

const monitoringPointsSlice = createSlice({
    name: 'monitoringPoints',
    initialState,
    reducers: {
        monitoringPointAdded: (state, action: PayloadAction<MonitoringPoint>) => {
            state.points.push(action.payload);
        },
        monitoringPointUpdated: (state, action: PayloadAction<MonitoringPoint>) => {
            const index = state.points.findIndex(point => point.id === action.payload.id);
            if (index !== -1) {
                state.points[index] = action.payload;
            }
        },
        monitoringPointDeleted: (state, action: PayloadAction<string>) => {
            state.points = state.points.filter(point => point.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonitoringPoints.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.points = action.payload;
            })
            .addCase(fetchMonitoringPoints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            })
            .addCase(createMonitoringPoint.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createMonitoringPoint.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.points.push(action.payload); // Adiciona o novo ponto de monitoramento ao estado Redux
            })
            .addCase(createMonitoringPoint.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            })
            ;
    },
});

export const { monitoringPointAdded, monitoringPointUpdated, monitoringPointDeleted } = monitoringPointsSlice.actions;

export default monitoringPointsSlice.reducer;
