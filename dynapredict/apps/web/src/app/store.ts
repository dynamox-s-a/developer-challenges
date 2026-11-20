import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/auth.slice';
import { healthReducer } from '../features/health/health.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
  },
});

// Tipos gerados a partir da própria store (o TypeScript descobre sozinho)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;