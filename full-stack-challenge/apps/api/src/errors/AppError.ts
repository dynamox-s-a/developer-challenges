export type ErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'PAYLOAD_TOO_LARGE'
  | 'BUSINESS_RULE_VIOLATION'
  | 'INTERNAL_ERROR';

/**
 * An expected failure with a known HTTP status. Services throw it; the central
 * errorHandler turns it into the response, so nothing else writes error bodies.
 */
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: ErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  static notFound(message: string) {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(409, 'CONFLICT', message, details);
  }

  static payloadTooLarge(message: string) {
    return new AppError(413, 'PAYLOAD_TOO_LARGE', message);
  }

  /** The request is well-formed but breaks a domain rule (e.g. TcAg on a Pump). */
  static unprocessable(message: string, details?: unknown) {
    return new AppError(422, 'BUSINESS_RULE_VIOLATION', message, details);
  }
}
