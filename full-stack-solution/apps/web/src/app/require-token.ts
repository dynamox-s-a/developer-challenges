import { ApiError } from "@web/api/api-error";
import type { RootState } from "./store";

/**
 * Reads the access token from the store, failing fast when there is none.
 *
 * Throwing an `ApiError` with status 401 (instead of sending an anonymous
 * request) lets the auth middleware end the session through the same path it
 * uses for a token the server rejected.
 */
export function requireToken(state: RootState): string {
  const { token } = state.auth;

  if (!token) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
  }

  return token;
}
