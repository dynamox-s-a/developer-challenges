import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

export interface SensorCreate {
    id: string;
    model: string;
    monitoring_point_id: number;
}

export const associateSensor = createAsyncThunk(
    'sensors/associate',
    async (sensorData: SensorCreate, { rejectWithValue }) => {
        try {
            const response = await api.post('/sensors', sensorData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Erro ao associar sensor');
        }
    }
);

export const sensorSlice = createSlice({
    name: 'sensors',
    initialState: { loading: false, error: null as string | null, success: false},
    reducers: {
        resetSensorState: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(associateSensor.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(associateSensor.fulfilled, (state) => { state.loading = false; state.success = true; })
        .addCase(associateSensor.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    }
});

export const { resetSensorState } = sensorSlice.actions;
export default sensorSlice.reducer;
