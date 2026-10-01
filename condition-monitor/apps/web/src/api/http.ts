/**
 * Error answered by the API, carrying its Problem Details body (API contract, "Errors").
 * `problem` is null when the response was not Problem Details, such as a proxy error.
 */
export class ApiError extends Error {
  /**
   * The status as text. Redux Toolkit keeps `code` when it serializes a thunk error, so
   * the status survives into rejected actions.
   */
  readonly code: string;

  constructor(
    readonly status: number,
    readonly problem: ProblemDetails | null,
  ) {
    super(problem?.detail ?? `Request failed with status ${status}.`);
    this.name = 'ApiError';
    this.code = String(status);
  }
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, unknown>[];
}

/** A field error of a 422 answer, as the API contract defines it. */
export interface FieldError {
  field: string;
  message: string;
}

export function fieldErrorsOf(error: ApiError): FieldError[] {
  return (error.problem?.errors ?? []).filter(
    (item): item is Record<string, unknown> & FieldError =>
      typeof item['field'] === 'string' && typeof item['message'] === 'string',
  );
}

/**
 * Every API call goes through here. The API is reached under `/api` on the same origin:
 * the Vite dev server proxies it, so the session cookie is sent (ADR 0008).
 */
export function getJson<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export function postJson<T = void>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

export function patchJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PATCH', path, body);
}

export function putJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PUT', path, body);
}

export function deleteJson(path: string): Promise<void> {
  return request<void>('DELETE', path);
}

/** A multipart form, such as a file upload; the browser writes its content type. */
export function postForm<T>(path: string, form: FormData): Promise<T> {
  return request<T>('POST', path, form);
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const json = body !== undefined && !(body instanceof FormData);
  const response = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(json ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body === undefined ? {} : { body: json ? JSON.stringify(body) : (body as FormData) }),
  });
  if (!response.ok) {
    throw new ApiError(response.status, await readProblem(response));
  }
  // 204 No Content has no body to read.
  return (response.status === 204 ? undefined : await response.json()) as T;
}

async function readProblem(response: Response): Promise<ProblemDetails | null> {
  if (!response.headers.get('content-type')?.includes('application/problem+json')) {
    return null;
  }
  return (await response.json()) as ProblemDetails;
}
