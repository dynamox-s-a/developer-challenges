/**
 * Parsing das consultas de alertas — vocabulário fechado, limites explícitos, parâmetro
 * desconhecido é 400. A janela `from`/`to` é OPCIONAL e recorta por interseção com o período
 * em que o alerta esteve ativo (ver `AlertListResponseDto`).
 */
import { BadRequestException } from '@nestjs/common';

import {
  ALERT_LEVELS,
  ALERT_LIST_SORT_COLUMNS,
  ALERT_STATUS_FILTERS,
  ALERT_TYPES,
  type AlertLevel,
  type AlertListSortColumn,
  type AlertStatusFilter,
  type AlertType,
} from '@dynamox/domain';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE = 100_000;
export const MAX_NOTE_LENGTH = 500;
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export const ALERT_LIST_QUERY_KEYS = [
  'status',
  'level',
  'type',
  'machine',
  'sensor',
  'search',
  'from',
  'to',
  'page',
  'pageSize',
  'sortBy',
  'sortDir',
] as const;

export function invalidAlertsQuery(message: string): BadRequestException {
  return new BadRequestException({ code: 'INVALID_ALERTS_QUERY', message });
}

export interface AlertListQuery {
  status: AlertStatusFilter | null;
  level: AlertLevel | null;
  type: AlertType | null;
  machine: string | null;
  sensor: string | null;
  /** Busca textual (sensor, máquina ou ponto), sem distinção de maiúsculas. */
  search: string | null;
  from: Date | null;
  to: Date | null;
  page: number;
  pageSize: number;
  sortBy: AlertListSortColumn;
  sortDir: SortDirection;
}

function optionalEnum<T extends string>(value: unknown, field: string, allowed: readonly T[]): T | null {
  if (value === undefined) return null;
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw invalidAlertsQuery(`O parâmetro "${field}" deve ser um destes valores: ${allowed.join(', ')}.`);
  }
  return value as T;
}

function optionalString(value: unknown, field: string, maxLength: number): string | null {
  if (value === undefined) return null;
  if (typeof value !== 'string' || value.trim() === '' || value.length > maxLength) {
    throw invalidAlertsQuery(`O parâmetro "${field}" deve ser um texto de 1 a ${maxLength} caracteres.`);
  }
  return value.trim();
}

function optionalInstant(value: unknown, field: string): Date | null {
  if (value === undefined) return null;
  const parsed = typeof value === 'string' ? Date.parse(value) : Number.NaN;
  if (!Number.isFinite(parsed)) throw invalidAlertsQuery(`O parâmetro "${field}" deve ser uma data ISO 8601 válida.`);
  return new Date(parsed);
}

function boundedInt(value: unknown, field: string, fallback: number, min: number, max: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) throw invalidAlertsQuery(`O parâmetro "${field}" deve ser um inteiro.`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw invalidAlertsQuery(`O parâmetro "${field}" deve estar entre ${min} e ${max}.`);
  }
  return parsed;
}

export function parseAlertListQuery(query: Record<string, unknown>): AlertListQuery {
  const unknown = Object.keys(query).filter((key) => !(ALERT_LIST_QUERY_KEYS as readonly string[]).includes(key));
  if (unknown.length > 0) {
    throw invalidAlertsQuery(`Parâmetro(s) não suportado(s): ${unknown.join(', ')}. Aceitos: ${ALERT_LIST_QUERY_KEYS.join(', ')}.`);
  }
  const from = optionalInstant(query.from, 'from');
  const to = optionalInstant(query.to, 'to');
  if (from && to && to.getTime() <= from.getTime()) throw invalidAlertsQuery('O parâmetro "to" deve ser posterior a "from".');
  return {
    status: optionalEnum(query.status, 'status', ALERT_STATUS_FILTERS),
    level: optionalEnum(query.level, 'level', ALERT_LEVELS),
    type: optionalEnum(query.type, 'type', ALERT_TYPES),
    machine: optionalString(query.machine, 'machine', 120),
    sensor: optionalString(query.sensor, 'sensor', 64),
    search: optionalString(query.search, 'search', 120),
    from,
    to,
    page: boundedInt(query.page, 'page', 1, 1, MAX_PAGE),
    pageSize: boundedInt(query.pageSize, 'pageSize', DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
    sortBy: optionalEnum(query.sortBy, 'sortBy', ALERT_LIST_SORT_COLUMNS) ?? 'openedAt',
    sortDir: optionalEnum(query.sortDir, 'sortDir', SORT_DIRECTIONS) ?? 'desc',
  };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseAlertIdParam(value: string): string {
  if (!UUID_PATTERN.test(value)) throw invalidAlertsQuery('O identificador do alerta deve ser um UUID.');
  return value;
}

export interface AcknowledgeAlertDto {
  note: string | null;
}

export function parseAcknowledgeDto(body: unknown): AcknowledgeAlertDto {
  if (body === undefined || body === null) return { note: null };
  if (typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException({ code: 'INVALID_ACKNOWLEDGE_PAYLOAD', message: 'O corpo deve ser um objeto JSON.' });
  }
  const keys = Object.keys(body);
  const unknown = keys.filter((key) => key !== 'note');
  if (unknown.length > 0) {
    throw new BadRequestException({
      code: 'INVALID_ACKNOWLEDGE_PAYLOAD',
      message: `Propriedade(s) não suportada(s): ${unknown.join(', ')}. Aceita: note.`,
    });
  }
  const { note } = body as { note?: unknown };
  if (note === undefined || note === null) return { note: null };
  if (typeof note !== 'string' || note.length > MAX_NOTE_LENGTH) {
    throw new BadRequestException({
      code: 'INVALID_ACKNOWLEDGE_PAYLOAD',
      message: `"note" deve ser um texto de até ${MAX_NOTE_LENGTH} caracteres.`,
    });
  }
  const trimmed = note.trim();
  return { note: trimmed === '' ? null : trimmed };
}
