import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { authReducer } from '../features/auth/authSlice';
import { dashboardReducer } from '../features/dashboard/dashboardSlice';
import { diagnosticsReducer } from '../features/diagnostics/diagnosticsSlice';
import { machinesReducer } from '../features/machines/machinesSlice';
import { monitoringPointsReducer } from '../features/monitoringPoints/monitoringPointsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  diagnostics: diagnosticsReducer,
  machines: machinesReducer,
  monitoringPoints: monitoringPointsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?: Partial<RootState>) {
  const completeState = preloadedState
    ? { ...rootReducer(undefined, { type: '@@INIT' }), ...preloadedState }
    : undefined;
  return configureStore({ reducer: rootReducer, preloadedState: completeState });
}

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
