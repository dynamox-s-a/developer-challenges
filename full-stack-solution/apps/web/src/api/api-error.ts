/** One field-level validation problem, as returned by the API. */
export interface ApiErrorDetail {
  path: string;
  message: string;
}

/**
 * Normalized API failure.
 *
 * The backend always answers errors with
 * `{ error: { code, message, details? } }`, so every failure the UI has to deal
 * with — including network errors — is funnelled into this single shape.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** `true` when the token is missing, expired or invalid. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

/** Plain, serializable projection of an `ApiError` — safe to keep in Redux. */
export interface SerializedApiError {
  status: number;
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export function serializeApiError(error: unknown): SerializedApiError {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  return {
    status: 0,
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "Unexpected error",
  };
}
