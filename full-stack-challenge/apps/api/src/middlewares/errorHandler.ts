import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client';
import { AppError } from '../errors/AppError';
import { uniqueViolationFields } from '../lib/prismaErrors';

export interface ErrorResponseBody {
  error: {
    code: AppError['code'];
    message: string;
    details?: unknown;
  };
}

function fromZod(error: ZodError) {
  return new AppError(
    400,
    'VALIDATION_ERROR',
    'Request validation failed',
    error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  );
}

function fromPrisma(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    // An operation depended on a record that doesn't exist (update/delete by id).
    case 'P2025':
      return AppError.notFound('Resource not found');
    // Unique constraint, e.g. a duplicate Sensor.serialNumber.
    case 'P2002':
      return AppError.conflict('Resource already exists', {
        fields: uniqueViolationFields(error),
      });
    default:
      return undefined;
  }
}

// body-parser tags its errors with a `type` instead of dedicated classes.
function bodyParserErrorType(error: unknown): string | undefined {
  return error instanceof Error
    ? (error as Error & { type?: string }).type
    : undefined;
}

function toAppError(error: unknown): AppError | undefined {
  if (error instanceof AppError) return error;
  if (error instanceof ZodError) return fromZod(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError)
    return fromPrisma(error);
  switch (bodyParserErrorType(error)) {
    case 'entity.parse.failed':
      return AppError.badRequest('Malformed JSON body');
    case 'entity.too.large':
      return AppError.payloadTooLarge('Request body is too large');
  }
  return undefined;
}

/** Central error handler: the only place that maps errors to HTTP responses. */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = toAppError(error);

  if (!appError) {
    console.error(error);
    const body: ErrorResponseBody = {
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    };
    res.status(500).json(body);
    return;
  }

  const body: ErrorResponseBody = {
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details === undefined ? {} : { details: appError.details }),
    },
  };
  res.status(appError.statusCode).json(body);
};
