// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './features/machinesSlice';

export const store = configureStore({
    reducer: {
        machines: machinesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
