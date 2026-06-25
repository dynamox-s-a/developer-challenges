import { configureStore } from '@reduxjs/toolkit';
import telemetryReducer from '../features/telemetry/telemetrySlice';

export const store = configureStore({
    reducer: {
        telemetry: telemetryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
