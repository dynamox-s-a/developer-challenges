import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './machineSlice';

export const store = configureStore({
  reducer: {
    machines: machinesReducer,
    // Futuramente adicionaremos 'points: pointsReducer' aqui
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;