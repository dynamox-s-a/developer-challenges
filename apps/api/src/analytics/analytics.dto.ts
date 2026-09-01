/**
 * Parsing das consultas analíticas. Mesma filosofia dos outros módulos: vocabulário
 * fechado, limites explícitos e parâmetro desconhecido é erro — nunca silêncio.
 *
 * A janela temporal é obrigatória em toda rota analítica: é o que garante que nenhuma
 * consulta volte a varrer o histórico inteiro.
 */
import { BadRequestException } from '@nestjs/common';

/** Teto da janela consultável de uma vez. Acima disso, o cliente pagina no tempo. */
export const MAX_RANGE_DAYS = 90;
export const DEFAULT_RANGE_DAYS = 7;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE = 100_000;
export const DEFAULT_SAMPLES_LIMIT = 500;
export const MAX_SAMPLES_LIMIT = 1000;

const DAY_MS = 86_400_000;

export function invalidAnalyticsQuery(message: string): BadRequestException {
  return new BadRequestException({ code: 'INVALID_ANALYTICS_QUERY', message });
}

/**
 * Identificador de URL que resolve para mais de um recurso. É erro de quem consulta (o
 * identificador não distingue), por isso 400 — e nunca uma escolha silenciosa entre os dois.
 */
export function ambiguousResourceKey(code: string, message: string): BadRequestException {
  return new BadRequestException({ code, message });
}

export interface TimeRange {
  from: Date;
  to: Date;
}

function parseInstant(value: unknown, field: string): Date {
  if (typeof value !== 'string' || value.trim() === '') {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" é obrigatório (data ISO 8601 em UTC).`);
  }
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" deve ser uma data ISO 8601 válida.`);
  }
  return new Date(parsed);
}

/** `to` é exclusivo; a janela é obrigatória, ordenada e limitada. */
export function parseTimeRange(query: Record<string, unknown>): TimeRange {
  const from = parseInstant(query.from, 'from');
  const to = parseInstant(query.to, 'to');
  if (to.getTime() <= from.getTime()) {
    throw invalidAnalyticsQuery('O parâmetro "to" deve ser posterior a "from".');
  }
  if (to.getTime() - from.getTime() > MAX_RANGE_DAYS * DAY_MS) {
    throw invalidAnalyticsQuery(`A janela consultada deve ter no máximo ${MAX_RANGE_DAYS} dias.`);
  }
  return { from, to };
}

export function assertKnownKeys(query: Record<string, unknown>, allowed: readonly string[]): void {
  const unknown = Object.keys(query).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw invalidAnalyticsQuery(
      `Parâmetro(s) não suportado(s): ${unknown.join(', ')}. Aceitos: ${allowed.join(', ')}.`,
    );
  }
}

export function parseBoundedInt(
  value: unknown,
  field: string,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" deve ser um inteiro.`);
  }
  const parsed = Number(value);
  // isSafeInteger barra valores que a regex aceita mas viram imprecisão no Number().
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" deve estar entre ${min} e ${max}.`);
  }
  return parsed;
}

export function parseOptionalBoolean(value: unknown, field: string): boolean {
  if (value === undefined) return false;
  if (value !== 'true' && value !== 'false') {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" deve ser "true" ou "false".`);
  }
  return value === 'true';
}

export function parseEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  fallback: T,
): T {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw invalidAnalyticsQuery(
      `O parâmetro "${field}" deve ser um destes valores: ${allowed.join(', ')}.`,
    );
  }
  return value as T;
}

export const FLEET_CONDITION_QUERY_KEYS = ['from', 'to', 'includeTrend', 'condition'] as const;
/** A máquina aceita recorte por condição (ela lista pontos); o ponto, não — ele é um só. */
export const MACHINE_QUERY_KEYS = ['from', 'to', 'condition'] as const;
export const POINT_QUERY_KEYS = ['from', 'to'] as const;
export const MACHINE_LIST_QUERY_KEYS = [
  'from',
  'to',
  'condition',
  'search',
  'page',
  'pageSize',
  'sortBy',
  'sortDir',
] as const;
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export const SERIES_POINTS_QUERY_KEYS = ['from', 'to', 'bucket'] as const;
export const HEATMAP_QUERY_KEYS = ['from', 'to', 'bucket'] as const;
export const TIME_WINDOW_QUERY_KEYS = ['from', 'to', 'page', 'pageSize'] as const;
export const ACQUISITIONS_QUERY_KEYS = ['from', 'to', 'page', 'pageSize', 'includeTotal'] as const;
export const RAW_SAMPLES_QUERY_KEYS = ['limit', 'cursor', 'quantity', 'axis'] as const;

/** Vocabulários públicos aceitos nos filtros de amostra bruta. */
export const SAMPLE_QUANTITIES = ['ACCELERATION', 'VELOCITY', 'TEMPERATURE', 'ROTATIONAL_SPEED'] as const;
export const SAMPLE_AXES = ['X', 'Y', 'Z', 'NONE'] as const;

export function parseOptionalEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): T | null {
  if (value === undefined) return null;
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw invalidAnalyticsQuery(
      `O parâmetro "${field}" deve ser um destes valores: ${allowed.join(', ')}.`,
    );
  }
  return value as T;
}

export function parseOptionalString(value: unknown, field: string, maxLength = 128): string | null {
  if (value === undefined) return null;
  if (typeof value !== 'string' || value.length === 0 || value.length > maxLength) {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" é inválido.`);
  }
  return value;
}

/** UUID malformado é 400; bem formado e inexistente é 404 — a mesma política do resto da API. */
export function parseUuidParam(value: string, field: string): string {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid.test(value)) {
    throw invalidAnalyticsQuery(`O parâmetro "${field}" deve ser um UUID.`);
  }
  return value;
}
