const TOKEN_KEY = "dynapredict.accessToken";

/**
 * Persists the access token in `localStorage` so a page reload keeps the user
 * signed in.
 *
 * Trade-off: `localStorage` is readable by any script on the origin (XSS). The
 * API returns the JWT in the response body and does not set a cookie, so the
 * client has to store it somewhere; a short token lifetime (`JWT_EXPIRES_IN`)
 * limits the exposure. Every accessor is guarded because storage throws in
 * private-browsing modes and is absent during server-side rendering.
 */
export const tokenStorage = {
  read(): string | null {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  write(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage unavailable: the token stays in memory for this session only.
    }
  },

  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Nothing to do — there is no token to forget.
    }
  },
};
