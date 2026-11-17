import { configureStore } from '@reduxjs/toolkit';
import { healthReducer } from '../features/health/health.slice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
  },
});

// Tipos gerados a partir da própria store (o TypeScript descobre sozinho)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;