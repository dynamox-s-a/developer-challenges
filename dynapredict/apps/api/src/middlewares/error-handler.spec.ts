import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.ts';
import { errorHandler } from './error-handler.ts';

// Roda o handler com uma resposta falsa, que só anota o status e o JSON
function handle(error: unknown) {
  const res = {} as Response;
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  errorHandler(error, {} as Request, res, vi.fn() as NextFunction);
  return res;
}

describe('errorHandler', () => {
  it('should answer an AppError with its own status and code', () => {
    const res = handle(
      new AppError(404, 'NOT_FOUND', 'Máquina não encontrada'),
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: 'Máquina não encontrada',
        details: undefined,
      },
    });
  });

  it('should answer 400 when the body is not valid JSON', () => {
    const error = Object.assign(new SyntaxError('Unexpected token'), {
      body: '{nome:',
    });
    const res = handle(error);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INVALID_JSON',
        message: 'O corpo da requisição não é um JSON válido',
      },
    });
  });

  it('should answer 500 without exposing unexpected errors', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = handle(new Error('detalhe interno que não pode vazar'));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
    });
    expect(log).toHaveBeenCalled(); // o erro de verdade fica só no terminal
    log.mockRestore();
  });
});
