import { configureStore } from '@reduxjs/toolkit';
import timeSeriesReducer from '@/types/timeSeriesSlice';

export const store = configureStore({
  reducer: {
    timeSeries: timeSeriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;