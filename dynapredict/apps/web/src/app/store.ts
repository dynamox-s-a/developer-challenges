import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/auth.slice';
import { healthReducer } from '../features/health/health.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  health: healthReducer,
});

// "Fábrica" de stores: cada chamada cria uma store nova, do zero.
// O app usa uma só; os testes criam uma por teste, sem um vazar no outro
export function setupStore() {
  return configureStore({ reducer: rootReducer });
}

export const store = setupStore();

// Tipos gerados a partir da própria store (o TypeScript descobre sozinho)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
