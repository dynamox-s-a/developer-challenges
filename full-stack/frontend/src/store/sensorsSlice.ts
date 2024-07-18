import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import {api} from "@/src/utils/apiClient";

export interface SensorPoint {
    monitoringId: string;
    machineType: string;
    modelName: string;
}

interface SensorState {
    points: SensorPoint[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SensorState = {
    points: [],
    status: 'idle',
    error: null,
};

export const associateSensor = createAsyncThunk(
    'sensors/associateSensor',
    async (newPoint: SensorPoint, { getState }) => {

        // Verificar a regra de negócio: impedir a criação de pontos associados a sensores 'TcAg' ou 'TcAs' para máquinas do tipo 'Pump'
        if (newPoint.machineType === 'Pump' && (newPoint.modelName === 'TcAg' || newPoint.modelName === 'TcAs')) {
            throw new Error(`Não é possível associar sensores ${newPoint.modelName} a uma máquina do tipo Pump.`);
        }

        const response = await api.post(`/monitoring-points/${newPoint.monitoringId}/associate-sensor`, {
            modelName: newPoint.modelName
        });
        return response.data;
    }
);

const sensorPointsSlice = createSlice({
    name: 'sensors',
    initialState,
    reducers: {
        sensorPointAdded: (state, action: PayloadAction<SensorPoint>) => {
            state.points.push(action.payload);
        },
        sensorPointUpdated: (state, action: PayloadAction<SensorPoint>) => {
            const index = state.points.findIndex(point => point.id === action.payload.id);
            if (index !== -1) {
                state.points[index] = action.payload;
            }
        },
        sensorPointDeleted: (state, action: PayloadAction<string>) => {
            state.points = state.points.filter(point => point.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(associateSensor.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(associateSensor.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.points.push(action.payload); // Adiciona o novo ponto de monitoramento ao estado Redux
            })
            .addCase(associateSensor.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ? action.error.message : null;
            });
    },
});

export const { sensorPointAdded, sensorPointUpdated, sensorPointDeleted } = sensorPointsSlice.actions;

export default sensorPointsSlice.reducer;
