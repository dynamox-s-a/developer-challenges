import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export const selectMeasurementsStatus = (state: RootState) => state.measurements.status;
export const selectMeasurementsError = (state: RootState) => state.measurements.error;
export const selectAllSeries = (state: RootState) => state.measurements.data;

export const selectAccelerationSeries = createSelector([selectAllSeries], (series) =>
	series.filter((item) => item.metric === 'accelerationRms'),
);

export const selectVelocitySeries = createSelector([selectAllSeries], (series) =>
	series.filter((item) => item.metric === 'velocityRms'),
);

export const selectTemperatureSeries = createSelector([selectAllSeries], (series) =>
	series.filter((item) => item.metric === 'temperature'),
);
