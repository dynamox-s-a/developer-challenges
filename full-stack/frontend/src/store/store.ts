import {configureStore} from '@reduxjs/toolkit';
import machinesReducer from './machinesSlice';
import monitoringPointsReducer from './monitoringPointsSlice'
import sensorsSlice from "./sensorsSlice";
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        machines: machinesReducer,
        monitoringPoints: monitoringPointsReducer,
        sensor: sensorsSlice,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;