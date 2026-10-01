import { NotFoundException } from '@nestjs/common';
import { VALIDATION_PROBLEM_TYPE } from '../validation/zod-validation.pipe';
import { ProblemException } from './problem.exception';

export const CONFLICT_PROBLEM_TYPE = 'urn:condition-monitor:error:conflict';

/** The request is valid but clashes with stored data (API contract, status codes). */
export function conflict(
  title: string,
  detail: string,
  errors: Record<string, unknown>[],
): ProblemException {
  return new ProblemException({ type: CONFLICT_PROBLEM_TYPE, title, status: 409, detail, errors });
}

/**
 * A resource that does not exist or belongs to another user: the answer is the same, so
 * it never reveals what other users have (assumption A4).
 */
export function notFound(resource: string): NotFoundException {
  return new NotFoundException(`${resource} not found.`);
}

/**
 * A request that passed the schema but breaks a rule only the stored data can check, such
 * as a position that does not belong to the machine's type. Same shape as a schema error.
 */
export function invalid(errors: { field: string; message: string }[]): ProblemException {
  return new ProblemException({
    type: VALIDATION_PROBLEM_TYPE,
    title: 'Invalid request',
    status: 422,
    detail: errors.length === 1 ? '1 field is invalid.' : `${errors.length} fields are invalid.`,
    errors,
  });
}

export const IMPORT_PROBLEM_TYPE = 'urn:condition-monitor:error:import';

/** At most this many errors travel in one answer; the detail still gives the full count. */
export const MAX_LISTED_ERRORS = 100;

/**
 * A submission of readings refused as a whole (assumption C4). Each error points at the
 * reading by its index in a JSON body or its line in a CSV file. The count covers every
 * invalid reading, even when only the first ones are listed, so nothing is left unsaid.
 */
export function importRejected(
  unit: 'reading' | 'line',
  errors: Record<string, unknown>[],
  invalidCount = errors.length,
): ProblemException {
  const listed = errors.slice(0, MAX_LISTED_ERRORS);
  const counted =
    invalidCount === 1 ? `1 ${unit} is invalid.` : `${invalidCount} ${unit}s are invalid.`;
  const truncated =
    listed.length < invalidCount ? ` The first ${listed.length} errors are listed.` : '';
  return new ProblemException({
    type: IMPORT_PROBLEM_TYPE,
    title: 'Import rejected',
    status: 422,
    detail: `${counted} Nothing was stored.${truncated}`,
    errors: listed,
  });
}

/** A file refused as a whole, before any line can be judged: not UTF-8, wrong header. */
export function fileRejected(message: string): ProblemException {
  return new ProblemException({
    type: IMPORT_PROBLEM_TYPE,
    title: 'Import rejected',
    status: 422,
    detail: `${message} Nothing was stored.`,
    errors: [{ field: 'file', message }],
  });
}
