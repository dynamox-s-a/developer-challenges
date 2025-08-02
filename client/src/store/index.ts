// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './features/machinesSlice';
import monitoringPointsReducer from './features/monitoringPointsSlice';

export const store = configureStore({
    reducer: {
        machines: machinesReducer,
        monitoringPoints: monitoringPointsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
