import type { PipeTransform, Type } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import type { ZodError } from 'zod';
import { ProblemException } from '../problem/problem.exception';

export const VALIDATION_PROBLEM_TYPE = 'urn:condition-monitor:error:validation';

/**
 * Validates every body, query and parameter that has a Zod DTO, before the controller
 * runs (ADR 0007). A failure answers 422 naming each field, as the API contract shows.
 */
export const ZodValidationPipe: Type<PipeTransform> = createZodValidationPipe({
  createValidationException: (error) => validationProblem(error as ZodError),
});

export function validationProblem(error: ZodError): ProblemException {
  const errors = error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));
  return new ProblemException({
    type: VALIDATION_PROBLEM_TYPE,
    title: 'Invalid request',
    status: 422,
    detail: errors.length === 1 ? '1 field is invalid.' : `${errors.length} fields are invalid.`,
    errors,
  });
}
