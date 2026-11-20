import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';

// Middleware de erro: o Express reconhece pelos 4 parâmetros (err, req, res, next)
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Erros "esperados", lançados pelo código (ex.: 400, 401, 404, 409)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // JSON mal formatado no corpo da requisição (erro gerado pelo express.json())
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'O corpo da requisição não é um JSON válido',
      },
    });
    return;
  }

  // Qualquer outro erro é inesperado: registra no terminal e responde 500
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
  });
};
