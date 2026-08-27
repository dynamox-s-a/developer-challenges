import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import machinesReducer from '../features/machines/machinesSlice';
import monitoringPointsReducer from '../features/monitoringPoints/monitoringPointsSlice';
import timeSeriesReducer from '../features/timeSeries/timeSeriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    machines: machinesReducer,
    monitoringPoints: monitoringPointsReducer,
    timeSeries: timeSeriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
