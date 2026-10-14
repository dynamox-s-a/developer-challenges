import { isRejected, type Middleware } from "@reduxjs/toolkit";
import type { SerializedApiError } from "@web/api/api-error";
import { sessionExpired, signIn } from "@web/features/auth/auth.slice";

/**
 * Ends the session as soon as any thunk is rejected with HTTP 401.
 *
 * Tokens expire while the app is open, and handling that in every feature
 * would duplicate the same branch many times. Login failures are excluded:
 * a wrong password is also a 401 but must stay on the login form.
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (isRejected(action) && action.type !== signIn.rejected.type) {
    const payload = action.payload as SerializedApiError | undefined;

    if (payload?.status === 401) {
      store.dispatch(sessionExpired());
    }
  }

  return result;
};
