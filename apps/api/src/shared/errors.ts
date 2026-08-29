import type { ApiErrorCode } from "@dyn/contracts";

export type ErrorStatus = 400 | 401 | 404 | 409 | 422 | 500;

export class DomainError extends Error {
  readonly code: ApiErrorCode;
  readonly status: ErrorStatus;
  readonly issues: Array<{ path: string; message: string }> | undefined;

  constructor(options: {
    code: ApiErrorCode;
    message: string;
    status: ErrorStatus;
    issues?: Array<{ path: string; message: string }>;
  }) {
    super(options.message);
    this.name = "DomainError";
    this.code = options.code;
    this.status = options.status;
    this.issues = options.issues;
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super({
      code: "NOT_FOUND",
      message: `${resource} was not found`,
      status: 404,
    });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super({
      code: "CONFLICT",
      message,
      status: 409,
    });
    this.name = "ConflictError";
  }
}

export class SensorIncompatibleError extends DomainError {
  constructor(message: string, issues: Array<{ path: string; message: string }>) {
    super({
      code: "SENSOR_INCOMPATIBLE",
      message,
      status: 422,
      issues,
    });
    this.name = "SensorIncompatibleError";
  }
}

// Accepts any issue-bearing parse failure so the shared module stays free of zod types.
export class ValidationError extends DomainError {
  constructor(error: {
    issues: ReadonlyArray<{
      path: ReadonlyArray<PropertyKey>;
      message: string;
    }>;
  }) {
    super({
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      status: 400,
      issues: error.issues.map((issue) => ({
        path: issue.path.map(String).join("."),
        message: issue.message,
      })),
    });
    this.name = "ValidationError";
  }
}
