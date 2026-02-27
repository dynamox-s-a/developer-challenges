/**
 * @fileoverview Centralized application error definitions. All errors are typed
 * via @fastify/error, carrying a status code and error code that the global
 * error handler uses to format consistent HTTP responses.
 */

import createError from '@fastify/error';
import { StatusCodes } from 'http-status-codes';

// AUTH
export const AUTH_ERR_INVALID_CREDENTIALS = createError(
  'AUTH_ERR_INVALID_CREDENTIALS',
  'Credenciais inválidas.',
  StatusCodes.UNAUTHORIZED,
);

export const AUTH_ERR_TOKEN_EXPIRED = createError(
  'AUTH_ERR_TOKEN_EXPIRED',
  'Token inválido ou expirado.',
  StatusCodes.UNAUTHORIZED,
);

export const AUTH_ERR_INSUFFICIENT_PERMISSIONS = createError(
  'AUTH_ERR_INSUFFICIENT_PERMISSIONS',
  'Permissões insuficientes.',
  StatusCodes.FORBIDDEN,
);

export const AUTH_ERR_TOO_MANY_REQUESTS = createError(
  'AUTH_ERR_TOO_MANY_REQUESTS',
  'Limite de requisições excedido. Por favor, tente novamente mais tarde.',
  StatusCodes.TOO_MANY_REQUESTS,
);

// MACHINE
export const MACHINE_ERR_ALREADY_EXISTS = createError(
  'MACHINE_ERR_ALREADY_EXISTS',
  'Já existe uma máquina com o mesmo nome e tipo.',
  StatusCodes.CONFLICT,
);

export const MACHINE_ERR_NOT_FOUND = createError(
  'MACHINE_ERR_NOT_FOUND',
  'Máquina não encontrada.',
  StatusCodes.NOT_FOUND,
);

// MONITORING POINT
export const MONITORING_POINT_ERR_ALREADY_EXISTS = createError(
  'MONITORING_POINT_ERR_ALREADY_EXISTS',
  'Já existe um ponto de monitoramento com este nome nesta máquina.',
  StatusCodes.CONFLICT,
);

export const MONITORING_POINT_ERR_NOT_FOUND = createError(
  'MONITORING_POINT_ERR_NOT_FOUND',
  'Monitoring point não encontrado.',
  StatusCodes.NOT_FOUND,
);

// SENSOR
export const SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE = createError(
  'SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE',
  'Este modelo de sensor não é permitido para este tipo de máquina.',
  StatusCodes.UNPROCESSABLE_ENTITY,
);

export const SENSOR_ERR_ALREADY_EXISTS = createError(
  'SENSOR_ERR_ALREADY_EXISTS',
  'Este ponto de monitoramento já possui um sensor associado.',
  StatusCodes.CONFLICT,
);

export const SENSOR_ERR_NOT_FOUND = createError(
  'SENSOR_ERR_NOT_FOUND',
  'Sensor não encontrado.',
  StatusCodes.NOT_FOUND,
);

// TIME SERIES
export const TIME_SERIES_ERR_DUPLICATE_TIMESTAMP = createError(
  'TIME_SERIES_ERR_DUPLICATE_TIMESTAMP',
  'Já existe um registro para este sensor neste timestamp.',
  StatusCodes.CONFLICT,
);

export const TIME_SERIES_ERR_INVALID_DATE_RANGE = createError(
  'TIME_SERIES_ERR_INVALID_DATE_RANGE',
  'A data de início não pode ser maior que a data final.',
  StatusCodes.BAD_REQUEST,
);

// USER
export const USER_ERR_NOT_FOUND = createError(
  'USER_ERR_NOT_FOUND',
  'Usuário não encontrado.',
  StatusCodes.NOT_FOUND,
);

// GENERIC
export const INTERNAL_SERVER_ERROR = createError(
  'INTERNAL_SERVER_ERROR',
  'Ocorreu um erro interno no servidor.',
  StatusCodes.INTERNAL_SERVER_ERROR,
);

/**
 * Attaches a root cause to a typed error for richer context in logs and Sentry.
 * Use in the data-access layer to wrap raw DB errors before re-throwing.
 */
export function withCause<T extends Error>(error: T, cause: unknown): T {
  error.cause = cause instanceof Error ? cause : new Error(String(cause));
  return error;
}
