import { BadRequestException } from '@nestjs/common';

import {
  MACHINE_TYPES,
  SENSOR_MODELS,
  isSensorModel,
  type MachineType,
  type SensorModel,
} from '@dynamox/domain';

export interface CreateMonitoringPointDto {
  machineId: string;
  name: string;
}

export interface AssignSensorDto {
  serialNumber: string;
  model: SensorModel;
}

/** Colunas visíveis na tabela do desafio; a ordenação aceita qualquer uma delas. */
export const MONITORING_POINT_SORT_COLUMNS = [
  'machineName',
  'machineType',
  'pointName',
  'sensorModel',
] as const;
export type MonitoringPointSortColumn = (typeof MONITORING_POINT_SORT_COLUMNS)[number];

export interface ListMonitoringPointsQuery {
  page: number;
  pageSize: number;
  sortBy: MonitoringPointSortColumn;
  sortDir: 'asc' | 'desc';
  /** Texto livre aplicado a nome da máquina, nome do ponto e série do sensor. */
  search: string | null;
  machineType: MachineType | null;
  sensorModel: SensorModel | null;
  /** true = só pontos com sensor; false = só pontos sem sensor; null = ambos. */
  hasSensor: boolean | null;
}

/** Limite defensivo da busca: texto maior que isto não é consulta, é abuso de índice. */
export const SEARCH_MAX_LENGTH = 120;

/** O enunciado fixa 5 por página; o parâmetro existe para testes e usos futuros. */
export const DEFAULT_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;

/** Mesmo limite defensivo do nome de máquina: o nome participa de índice único. */
export const MONITORING_POINT_NAME_MAX_LENGTH = 120;
export const SENSOR_SERIAL_MAX_LENGTH = 60;

const CREATE_KEYS = ['machineId', 'name'] as const;
const SENSOR_KEYS = ['serialNumber', 'model'] as const;

function invalidPayload(message: string): BadRequestException {
  return new BadRequestException({ code: 'INVALID_MONITORING_POINT_PAYLOAD', message });
}

function asObject(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw invalidPayload('O corpo da requisição deve ser um objeto JSON.');
  }
  return body as Record<string, unknown>;
}

function assertNoUnknownKeys(
  body: Record<string, unknown>,
  allowed: readonly string[],
): void {
  const unknown = Object.keys(body).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw invalidPayload(
      `Propriedade(s) não suportada(s): ${unknown.join(', ')}. Aceitos: ${allowed.join(', ')}.`,
    );
  }
}

function parseRequiredString(
  value: unknown,
  field: string,
  maxLength: number,
): string {
  if (typeof value !== 'string') {
    throw invalidPayload(`O campo "${field}" deve ser uma string.`);
  }
  const parsed = value.trim();
  if (parsed === '') {
    throw invalidPayload(`O campo "${field}" não pode ser vazio.`);
  }
  if (parsed.length > maxLength) {
    throw invalidPayload(`O campo "${field}" deve ter no máximo ${maxLength} caracteres.`);
  }
  return parsed;
}

/**
 * Ids de máquina são UUID (Prisma `@default(uuid())`). Validar o formato aqui separa
 * duas respostas que o consumidor precisa distinguir: identificador malformado é 400,
 * identificador bem formado que não existe é 404.
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseUuid(value: unknown, field: string): string {
  const parsed = parseRequiredString(value, field, 64);
  if (!UUID_PATTERN.test(parsed)) {
    throw invalidPayload(`O campo "${field}" deve ser um UUID.`);
  }
  return parsed;
}

export function parseCreateMonitoringPointDto(body: unknown): CreateMonitoringPointDto {
  const object = asObject(body);
  assertNoUnknownKeys(object, CREATE_KEYS);
  return {
    machineId: parseUuid(object.machineId, 'machineId'),
    name: parseRequiredString(object.name, 'name', MONITORING_POINT_NAME_MAX_LENGTH),
  };
}

export function parseAssignSensorDto(body: unknown): AssignSensorDto {
  const object = asObject(body);
  assertNoUnknownKeys(object, SENSOR_KEYS);

  const serialNumber = parseRequiredString(
    object.serialNumber,
    'serialNumber',
    SENSOR_SERIAL_MAX_LENGTH,
  );

  if (!isSensorModel(object.model)) {
    throw new BadRequestException({
      code: 'INVALID_SENSOR_MODEL',
      message: `O campo "model" deve ser um destes valores: ${SENSOR_MODELS.join(', ')}.`,
    });
  }

  return { serialNumber, model: object.model };
}

function invalidQuery(message: string): BadRequestException {
  return new BadRequestException({ code: 'INVALID_MONITORING_POINT_QUERY', message });
}

/** Teto de página: acima disso o offset deixa de ter uso real e só estressa o banco. */
export const MAX_PAGE = 100_000;

const QUERY_KEYS = [
  'page',
  'pageSize',
  'sortBy',
  'sortDir',
  'search',
  'machineType',
  'sensorModel',
  'hasSensor',
] as const;

/**
 * Filtros e busca são opcionais, mas quando presentes precisam ser reconhecíveis: um
 * valor inválido vira 400 em vez de ser ignorado silenciosamente, senão o cliente acha
 * que filtrou e recebe a lista inteira.
 */
function parseOptionalString(value: unknown, field: string, maxLength: number): string | null {
  if (value === undefined) return null;
  if (typeof value !== 'string') {
    throw invalidQuery(`O parâmetro "${field}" deve ser texto.`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > maxLength) {
    throw invalidQuery(`O parâmetro "${field}" deve ter no máximo ${maxLength} caracteres.`);
  }
  return trimmed;
}

function parseOptionalEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): T | null {
  if (value === undefined) return null;
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw invalidQuery(`O parâmetro "${field}" deve ser um destes valores: ${allowed.join(', ')}.`);
  }
  return value as T;
}

function parseOptionalBoolean(value: unknown, field: string): boolean | null {
  if (value === undefined) return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw invalidQuery(`O parâmetro "${field}" deve ser "true" ou "false".`);
}

function parseBoundedInt(
  value: unknown,
  field: string,
  fallback: number,
  max: number,
): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw invalidQuery(`O parâmetro "${field}" deve ser um inteiro positivo.`);
  }
  const parsed = Number(value);
  // isSafeInteger barra valores gigantes que a regex aceita mas viram Infinity/imprecisão
  // no Number(): sem isso, um page absurdo chegaria ao OFFSET como 500 em vez de 400.
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw invalidQuery(`O parâmetro "${field}" deve ser um inteiro positivo.`);
  }
  if (parsed > max) {
    throw invalidQuery(`O parâmetro "${field}" deve ser no máximo ${max}.`);
  }
  return parsed;
}

export function parseListMonitoringPointsQuery(
  query: Record<string, unknown>,
): ListMonitoringPointsQuery {
  // Mesma filosofia da validação de corpo: parâmetro desconhecido é erro, não silêncio.
  const unknown = Object.keys(query).filter(
    (key) => !(QUERY_KEYS as readonly string[]).includes(key),
  );
  if (unknown.length > 0) {
    throw invalidQuery(
      `Parâmetro(s) não suportado(s): ${unknown.join(', ')}. Aceitos: ${QUERY_KEYS.join(', ')}.`,
    );
  }

  const page = parseBoundedInt(query.page, 'page', 1, MAX_PAGE);
  const pageSize = parseBoundedInt(query.pageSize, 'pageSize', DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  const sortBy = query.sortBy ?? 'machineName';
  if (
    typeof sortBy !== 'string' ||
    !(MONITORING_POINT_SORT_COLUMNS as readonly string[]).includes(sortBy)
  ) {
    throw invalidQuery(
      `O parâmetro "sortBy" deve ser um destes valores: ${MONITORING_POINT_SORT_COLUMNS.join(', ')}.`,
    );
  }

  const sortDir = query.sortDir ?? 'asc';
  if (sortDir !== 'asc' && sortDir !== 'desc') {
    throw invalidQuery('O parâmetro "sortDir" deve ser "asc" ou "desc".');
  }

  return {
    page,
    pageSize,
    sortBy: sortBy as MonitoringPointSortColumn,
    sortDir,
    search: parseOptionalString(query.search, 'search', SEARCH_MAX_LENGTH),
    machineType: parseOptionalEnum(query.machineType, 'machineType', MACHINE_TYPES),
    sensorModel: parseOptionalEnum(query.sensorModel, 'sensorModel', SENSOR_MODELS),
    hasSensor: parseOptionalBoolean(query.hasSensor, 'hasSensor'),
  };
}
