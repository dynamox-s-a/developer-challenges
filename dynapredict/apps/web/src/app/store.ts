import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer, logout } from '../features/auth/auth.slice';
import { healthReducer } from '../features/health/health.slice';
import { machinesReducer } from '../features/machines/machines.slice';
import { monitoringPointsReducer } from '../features/monitoring-points/monitoring-points.slice';
import { timeSeriesDetailsReducer } from '../features/time-series/time-series-details.slice';
import { timeSeriesReducer } from '../features/time-series/time-series.slice';
import { setOnUnauthorized } from '../lib/api-client';

const rootReducer = combineReducers({
  auth: authReducer,
  health: healthReducer,
  machines: machinesReducer,
  monitoringPoints: monitoringPointsReducer,
  timeSeries: timeSeriesReducer,
  timeSeriesDetails: timeSeriesDetailsReducer,
});

// "Fábrica" de stores: cada chamada cria uma store nova, do zero.
// O app usa uma só; os testes criam uma por teste, sem um vazar no outro
export function setupStore() {
  const store = configureStore({ reducer: rootReducer });

  // Quando qualquer chamada à API responder 401, desloga mostrando o motivo.
  // Só existe um "ouvinte": a store criada por último é a que recebe o aviso
  setOnUnauthorized(() => {
    store.dispatch(logout('Sua sessão expirou. Entre novamente.'));
  });

  return store;
}

export const store = setupStore();

// Tipos gerados a partir da própria store (o TypeScript descobre sozinho)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
