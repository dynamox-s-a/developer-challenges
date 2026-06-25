import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTelemetryData } from './telemetry.api';
import type { RawSeries } from './telemetry.types';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type TelemetryState = {
    series: RawSeries[];
    status: Status;
    error: string | null;
};

const initialState: TelemetryState = {
    series: [],
    status: 'idle',
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
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTelemetry.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.series = action.payload;
            })
            .addCase(fetchTelemetry.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Erro desconhecido';
            });
    },
});

export default telemetrySlice.reducer;
