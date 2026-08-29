import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { ApiClient } from "../api/client";
import { authReducer, logout, sessionExpired } from "../features/auth/authSlice";
import { machinesReducer } from "../features/machines/machinesSlice";
import { monitoringReducer } from "../features/monitoring/monitoringSlice";
import { notificationsReducer } from "../features/notifications/notificationsSlice";
import { timeSeriesReducer } from "../features/time-series/timeSeriesSlice";

const applicationReducer = combineReducers({
  auth: authReducer,
  machines: machinesReducer,
  monitoring: monitoringReducer,
  notifications: notificationsReducer,
  timeSeries: timeSeriesReducer,
});

const rootReducer: typeof applicationReducer = (state, action) => {
  if (logout.match(action) || sessionExpired.match(action)) {
    return applicationReducer(undefined, action);
  }
  return applicationReducer(state, action);
};

export function createAppStore(api: ApiClient) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
