import { configureStore } from '@reduxjs/toolkit';
import { sessionExpired } from '../features/auth/authSlice';
import { persistColorMode } from '../features/ui/uiSlice';
import { setUnauthorizedHandler } from '../services/apiClient';
import { rootReducer, type RootState } from './rootReducer';

/**
 * Builds a store. Tests call it with a preloaded state to start from a known
 * point; the app uses the singleton below.
 */
export function setupStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({ reducer: rootReducer, preloadedState });

  // Persist the colour mode only when it changes, not on every action.
  let colorMode = store.getState().ui.colorMode;
  store.subscribe(() => {
    const next = store.getState().ui.colorMode;
    if (next !== colorMode) {
      colorMode = next;
      persistColorMode(next);
    }
  });

  return store;
}

export const store = setupStore();

// A 401 on a private request means the session ended while the app was open.
setUnauthorizedHandler(() => store.dispatch(sessionExpired()));

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type { RootState };
