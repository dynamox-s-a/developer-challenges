import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@web/features/auth/auth.slice";
import { machinesReducer } from "@web/features/machines/machines.slice";
import { monitoringPointsReducer } from "@web/features/monitoring-points/monitoring-points.slice";
import { notificationsReducer } from "@web/features/notifications/notifications.slice";
import { timeSeriesReducer } from "@web/features/time-series/time-series.slice";
import { authMiddleware } from "./auth-middleware";
import { tokenPersistenceMiddleware } from "./token-persistence-middleware";

export const rootReducer = combineReducers({
  auth: authReducer,
  machines: machinesReducer,
  monitoringPoints: monitoringPointsReducer,
  timeSeries: timeSeriesReducer,
  notifications: notificationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Builds a store instance.
 *
 * Exported as a factory (and not only as the singleton below) so that each test
 * gets an isolated store, optionally seeded with `preloadedState`.
 */
export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authMiddleware, tokenPersistenceMiddleware),
  });
}

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
