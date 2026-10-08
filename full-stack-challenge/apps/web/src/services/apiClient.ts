import type { ApiErrorBody } from '@dynapredict/shared-types';
import axios, { isAxiosError } from 'axios';

const DEFAULT_API_URL = 'http://localhost:3333/api/v1';

/**
 * The single HTTP client. The session is an httpOnly cookie the browser
 * attaches on its own, so every request must send credentials (cross-origin
 * in production: Vercel → Render).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  withCredentials: true,
});

/**
 * A 401 from these routes is an expected answer, not an expired session:
 * wrong credentials on login, and "nobody logged in" when the app boots.
 */
const AUTH_PROBE_PATHS = ['/auth/login', '/auth/me'];

let onUnauthorized: (() => void) | null = null;

/**
 * Registers what to do when the session expires mid-use (normally dispatching
 * logout). Injected by the store instead of imported here, so this module
 * never depends on Redux and there is no store ↔ client import cycle.
 */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(undefined, (error: unknown) => {
  if (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    !AUTH_PROBE_PATHS.includes(error.config?.url ?? '')
  ) {
    onUnauthorized?.();
  }
  return Promise.reject(error);
});

/** What thunks reject with: serializable, so it can live in Redux state. */
export interface ApiError {
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
}

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as ApiErrorBody).error?.message === 'string'
  );
}

/**
 * Normalizes anything a request can throw into an `ApiError`: the API's
 * `{ error: { code, message, details } }` body when there is one, otherwise
 * a network or unexpected failure.
 */
export function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const data: unknown = error.response?.data;
    if (isApiErrorBody(data)) {
      return { status, ...data.error };
    }
    if (status === null) {
      return {
        status,
        code: 'NETWORK_ERROR',
        message: 'Could not reach the server. Check your connection.',
      };
    }
    return { status, code: 'HTTP_ERROR', message: error.message };
  }
  return {
    status: null,
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Unexpected error',
  };
}
