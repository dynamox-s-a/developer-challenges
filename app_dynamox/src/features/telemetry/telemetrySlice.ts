import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTelemetryData } from './telemetry.api';
import type { RawSeries } from './telemetry.types';

type TelemetryState = {
    series: RawSeries[];
    isLoading: Boolean;
    error: string | null;
};

const initialState: TelemetryState = {
    series: [],
    isLoading: false,
    error: null,
};

export const fetchTelemetry = createAsyncThunk('telemetry/fetch', fetchTelemetryData);

const telemetrySlice = createSlice({
    name: 'telemetry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTelemetry.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTelemetry.fulfilled, (state, action) => {
                state.isLoading = false;
                state.series = action.payload;
            })
            .addCase(fetchTelemetry.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? 'Erro desconhecido';
            });
    },
});

export default telemetrySlice.reducer;
