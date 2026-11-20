import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../errors/app-error.ts';
import { validateBody } from './validate-body.ts';

const schema = z.object({ name: z.string().trim().min(1, 'Informe o nome') });

// Roda o middleware com um req falso: ele só usa o req.body e o next
function run(body: unknown) {
  const req = { body } as Request;
  const next = vi.fn();
  validateBody(schema)(req, {} as Response, next as NextFunction);
  return { req, next };
}

describe('validateBody', () => {
  it('should replace the body with the parsed data and call next', () => {
    const { req, next } = run({ name: '  Bomba 01  ' });

    expect(req.body).toEqual({ name: 'Bomba 01' });
    expect(next).toHaveBeenCalledOnce();
  });

  it('should throw a 400 error with the message of each field', () => {
    let error: unknown;
    try {
      run({ name: '' });
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: { fieldErrors: { name: ['Informe o nome'] } },
    });
  });
});