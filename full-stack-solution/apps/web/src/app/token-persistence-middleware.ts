import type { Middleware } from "@reduxjs/toolkit";
import { tokenStorage } from "@web/features/auth/token-storage";
import type { RootState } from "./store";

/**
 * Mirrors the access token into `localStorage`.
 *
 * Persistence lives here rather than in the reducers (which must stay pure) or
 * spread across the thunks: whatever causes the token to appear or disappear —
 * sign in, sign out, a rejected session, a 401 — storage follows the store from
 * one place.
 */
export const tokenPersistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const before = (store.getState() as RootState).auth.token;
    const result = next(action);
    const after = (store.getState() as RootState).auth.token;

    if (before !== after) {
      if (after) {
        tokenStorage.write(after);
      } else {
        tokenStorage.clear();
      }
    }

    return result;
  };
