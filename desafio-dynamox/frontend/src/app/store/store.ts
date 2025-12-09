import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './machineSlice';
import pointsReducer from './pointsSlice';

export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    points: pointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;