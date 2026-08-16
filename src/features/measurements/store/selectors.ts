import type { RootState } from '@/store';

export const selectMeasurementsStatus = (state: RootState) => state.measurements.status;
export const selectMeasurementsError = (state: RootState) => state.measurements.error;
export const selectAllSeries = (state: RootState) => state.measurements.data;

export const selectAccelerationSeries = (state: RootState) =>
	state.measurements.data.filter((s) => s.metric === 'accelerationRms');

export const selectVelocitySeries = (state: RootState) =>
	state.measurements.data.filter((s) => s.metric === 'velocityRms');

export const selectTemperatureSeries = (state: RootState) =>
	state.measurements.data.filter((s) => s.metric === 'temperature');
