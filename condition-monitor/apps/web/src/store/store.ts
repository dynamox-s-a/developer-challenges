import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isRejected,
} from '@reduxjs/toolkit';
import type { RequestFailure } from '../api/failure';
import { healthSlice } from '../features/health/health-slice';
import { importSlice } from '../features/import/import-slice';
import { machineDetailSlice } from '../features/machine-detail/machine-detail-slice';
import { machinesSlice } from '../features/machines/machines-slice';
import { monitoringPointsSlice } from '../features/monitoring-points/monitoring-points-slice';
import { overviewSlice } from '../features/overview/overview-slice';
import { pointDetailSlice } from '../features/point-detail/point-detail-slice';
import { sectorsSlice } from '../features/sectors/sectors-slice';
import {
  fetchSession,
  login,
  sessionExpired,
  sessionSlice,
} from '../features/session/session-slice';

/** One slice per domain area (ADR 0005); each feature slice adds its reducer here. */
const rootReducer = combineReducers({
  [healthSlice.name]: healthSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [sectorsSlice.name]: sectorsSlice.reducer,
  [machinesSlice.name]: machinesSlice.reducer,
  [machineDetailSlice.name]: machineDetailSlice.reducer,
  [monitoringPointsSlice.name]: monitoringPointsSlice.reducer,
  [overviewSlice.name]: overviewSlice.reducer,
  [importSlice.name]: importSlice.reducer,
  [pointDetailSlice.name]: pointDetailSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Any request answered 401 means the session is over, for example because it expired.
 * Handled here once, instead of in every thunk. Login and the session check are left out:
 * for them a 401 is an expected answer, not an expiry.
 */
function createSessionListener() {
  const listener = createListenerMiddleware();
  listener.startListening({
    predicate: (action) =>
      isRejected(action) &&
      answeredUnauthorized(action) &&
      !login.rejected.match(action) &&
      !fetchSession.rejected.match(action),
    effect: (_action, api) => {
      api.dispatch(sessionExpired());
    },
  });
  return listener.middleware;
}

/**
 * A thunk rejects either with a thrown ApiError, whose status survives as `error.code`,
 * or with a RequestFailure value, which carries it as `payload.status`.
 */
function answeredUnauthorized(action: { error: { code?: string }; payload?: unknown }): boolean {
  return (
    action.error.code === '401' || (action.payload as RequestFailure | undefined)?.status === 401
  );
}

/** A factory, so each test gets a fresh store with the state it needs. */
export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) => getDefault().prepend(createSessionListener()),
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
