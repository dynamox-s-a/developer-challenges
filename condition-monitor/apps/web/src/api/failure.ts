import { ApiError, fieldErrorsOf, type FieldError } from './http';

/**
 * Why a request failed, in the shape a screen shows it. Thunks reject with this value:
 * a plain thunk error would lose the API's field errors when Redux serializes it.
 */
export interface RequestFailure {
  /** HTTP status, or null when the API could not be reached. */
  status: number | null;
  message: string;
  fieldErrors: FieldError[];
  /**
   * Errors that belong to no form field, such as the points a machine type change would
   * invalidate, as "name: reason" lines the screen lists under the message.
   */
  reasons: string[];
}

function reasonsOf(error: ApiError): string[] {
  return (error.problem?.errors ?? []).flatMap((item) =>
    typeof item['reason'] === 'string'
      ? [typeof item['name'] === 'string' ? `${item['name']}: ${item['reason']}` : item['reason']]
      : [],
  );
}

export function toFailure(error: unknown): RequestFailure {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      message: error.message,
      fieldErrors: fieldErrorsOf(error),
      reasons: reasonsOf(error),
    };
  }
  return {
    status: null,
    message: 'Could not reach the API. Try again in a moment.',
    fieldErrors: [],
    reasons: [],
  };
}
