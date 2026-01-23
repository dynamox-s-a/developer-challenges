import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { addAsyncHandlers } from "../../utils/redux.utils";

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
        addAsyncHandlers(builder, associateSensor, {
            onFulfilled: (state) => {
                state.success = true;
            }
        });
    }
});

export const { resetSensorState } = sensorSlice.actions;
export default sensorSlice.reducer;
