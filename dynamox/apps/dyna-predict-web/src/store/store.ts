import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth.slice';
import reportsReducer from './features/reports/report.slice';
import machinesReducer from './features/machines/machine.slice';
import monitoringPointsReducer from './features/monitoring-points/monitoring-points.slice';
import timeSeriesReducer from './features/time-series/time-series.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
    timeSeries: timeSeriesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
