import { expect } from 'vitest';

type ErrorConstructor = new () => { code: string; message: string; statusCode: number };

export function createErrorResponse(ErrorClass: ErrorConstructor) {
  const { code, message, statusCode } = new ErrorClass();
  return { error: { code, message, statusCode } };
}

export function createPartialErrorResponse(ErrorClass: ErrorConstructor) {
  const { code, statusCode } = new ErrorClass();
  return { error: expect.objectContaining({ code, statusCode }) };
}
