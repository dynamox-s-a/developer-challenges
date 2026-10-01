/**
 * Error body shared by every route, following Problem Details (RFC 9457), as defined in
 * the API contract. `errors` points at what failed: a field, a CSV line or a record.
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, unknown>[];
}

export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

/** RFC 9457: `about:blank` when the problem has no semantics beyond its HTTP status. */
export const GENERIC_PROBLEM_TYPE = 'about:blank';
