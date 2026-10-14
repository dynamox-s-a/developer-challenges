import { ApiError, type ApiErrorDetail } from "./api-error";

/**
 * Origin of the API.
 *
 * Empty by default: the dev server proxies `/api` to the Express app (see
 * `vite.config.ts`) and in production both are served from the same origin, so
 * same-origin relative requests avoid CORS entirely. Set `VITE_API_URL` when
 * the API lives somewhere else.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** JSON request body. Serialized with `JSON.stringify`. */
  body?: unknown;
  /** Query string values; `undefined` and `null` entries are dropped. */
  query?: Record<string, QueryValue>;
  /** Bearer token. Omitted for public endpoints such as login. */
  token?: string | null;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = `${API_BASE_URL}${path}`;

  if (!query) {
    return url;
  }

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      search.append(key, String(value));
    }
  }

  const queryString = search.toString();
  return queryString ? `${url}?${queryString}` : url;
}

interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: ApiErrorDetail[] };
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody = {};

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    // Non-JSON error responses (proxy errors, gateway timeouts) fall through
    // to the generic message below.
  }

  return new ApiError(
    response.status,
    body.error?.code ?? "HTTP_ERROR",
    body.error?.message ?? `Request failed with status ${response.status}`,
    body.error?.details,
  );
}

/**
 * Performs a JSON request against the API.
 *
 * Resolves with the parsed body (`undefined` for `204 No Content`) and rejects
 * with an {@link ApiError} for any non-2xx response or network failure.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, token, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Could not reach the server. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
