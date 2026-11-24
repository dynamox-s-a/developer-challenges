import { z } from 'zod';
import { AppError } from '../errors/app-error.ts';

// Valida o req.query com um schema do zod e devolve os dados já convertidos.
// Não é um middleware como o validateBody porque, no Express 5, o req.query
// é só leitura: não dá para trocá-lo pelos dados validados
export function parseQuery<T extends z.ZodType>(
  schema: T,
  query: unknown,
): z.output<T> {
  const result = schema.safeParse(query);

  if (!result.success) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Parâmetros inválidos',
      z.flattenError(result.error),
    );
  }

  return result.data;
}
