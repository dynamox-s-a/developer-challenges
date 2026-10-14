import type { AuthUser, LoginInput, LoginResponse } from "@full-stack-solution/shared";
import { request } from "@web/api/http-client";

/** `POST /api/auth/login` — exchanges credentials for a JWT. */
export function login(credentials: LoginInput): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

/** `GET /api/auth/me` — validates the stored token and returns its owner. */
export function getCurrentUser(token: string): Promise<AuthUser> {
  return request<AuthUser>("/api/auth/me", { token });
}

/**
 * `POST /api/auth/logout`.
 *
 * Logout is stateless on the server (there is no token blacklist), so this call
 * is best-effort: the client drops the token either way.
 */
export function logout(token: string): Promise<void> {
  return request<void>("/api/auth/logout", { method: "POST", token });
}
