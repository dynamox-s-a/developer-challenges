import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MeasurementSeries } from '@/features/measurements/model/types';

export interface MeasurementsState {
	data: MeasurementSeries[];
	status: 'idle' | 'loading' | 'success' | 'error';
	error: string | null;
}

const initialState: MeasurementsState = {
	data: [],
	status: 'idle',
	error: null,
};

export const measurementsSlice = createSlice({
	name: 'measurements',
	initialState,
	reducers: {
		measurementsRequested(state) {
			state.status = 'loading';
			state.error = null;
		},
		measurementsSucceeded(state, action: PayloadAction<MeasurementSeries[]>) {
			state.status = 'success';
			state.data = action.payload;
		},
		measurementsFailed(state, action: PayloadAction<string>) {
			state.status = 'error';
			state.error = action.payload;
		},
	},
});

export const { measurementsRequested, measurementsSucceeded, measurementsFailed } =
	measurementsSlice.actions;

export default measurementsSlice.reducer;
