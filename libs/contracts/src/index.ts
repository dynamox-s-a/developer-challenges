import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

import type { Axis, PhysicalQuantity } from '@dynamox/domain';

export const SCHEMA_RELATIVE_PATH = join('contracts', 'dynamox', 'telemetry-cycle.schema.json');
export const EXAMPLE_RELATIVE_PATH = join(
  'contracts',
  'dynamox',
  'examples',
  'telemetry-cycle.example.json',
);

export interface TelemetryDataPoint {
  timestamp: string;
  value: number;
}

export interface TelemetryMeasurementAttributes {
  physicalQuantity: PhysicalQuantity;
  axis?: Axis;
  unit: string;
  displayName?: Record<string, string>;
  [key: string]: unknown;
}

export interface TelemetryMeasurement {
  resourceId: string;
  attributes: TelemetryMeasurementAttributes;
  dataPoints: TelemetryDataPoint[];
}

export interface TelemetryCycleMetadata {
  origin: 'simulation' | 'rosbag-replay' | 'seed' | 'manual';
  generator: { name: string; version: string; [key: string]: unknown };
  profile?: string;
  cycleId?: string;
  seed?: number;
  synthetic?: boolean;
  [key: string]: unknown;
}

export interface MonitoringLocationMapEntry {
  mapLabel: string;
  mapValue: string | null;
}

export interface TelemetryCycleConfiguration {
  monitoringLocationMap: MonitoringLocationMapEntry[];
  rpm?: number;
  loadPercent?: number;
  scenario?: 'normal' | 'imbalance';
  seed?: number;
  durationSeconds?: number;
  publishRateHz?: number;
  [key: string]: unknown;
}

export interface TelemetryCyclePayload {
  telemetryCycleData: {
    measuringSystemUniqueIdentifier: string;
    measuringSystemModel: { name: string; version: number };
    measurements: TelemetryMeasurement[];
    metadata: TelemetryCycleMetadata;
    tags: string[];
  };
  configuration: TelemetryCycleConfiguration;
}

export interface ContractViolation {
  path: string;
  message: string;
}

export type ValidationResult =
  | { valid: true; payload: TelemetryCyclePayload }
  | { valid: false; violations: ContractViolation[] };

/**
 * O schema vive em contracts/dynamox/ e é a única fonte de verdade compartilhada por
 * simulador, backend e testes. Subir a árvore a partir deste módulo funciona tanto
 * rodando de src (testes) quanto de dist (runtime), sem depender do cwd do processo.
 */
export function findRepositoryRoot(startDir: string = __dirname): string {
  let current = resolve(startDir);

  for (;;) {
    if (existsSync(join(current, SCHEMA_RELATIVE_PATH))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(
        `Não foi possível localizar ${SCHEMA_RELATIVE_PATH} a partir de ${startDir}. ` +
          'O contrato interno do SCP-04 precisa estar presente no repositório.',
      );
    }
    current = parent;
  }
}

export function loadTelemetryCycleSchema(): Record<string, unknown> {
  const root = findRepositoryRoot();
  return JSON.parse(readFileSync(join(root, SCHEMA_RELATIVE_PATH), 'utf8')) as Record<
    string,
    unknown
  >;
}

export function loadTelemetryCycleExample(): TelemetryCyclePayload {
  const root = findRepositoryRoot();
  return JSON.parse(
    readFileSync(join(root, EXAMPLE_RELATIVE_PATH), 'utf8'),
  ) as TelemetryCyclePayload;
}

let compiled: ValidateFunction | undefined;

function getValidator(): ValidateFunction {
  if (!compiled) {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    compiled = ajv.compile(loadTelemetryCycleSchema());
  }
  return compiled;
}

function toViolation(error: ErrorObject): ContractViolation {
  return {
    path: error.instancePath === '' ? '(raiz)' : error.instancePath,
    message: error.message ?? 'violação de contrato não descrita',
  };
}

export function validateTelemetryCycle(payload: unknown): ValidationResult {
  const validate = getValidator();
  if (validate(payload)) {
    return { valid: true, payload: payload as TelemetryCyclePayload };
  }
  return {
    valid: false,
    violations: (validate.errors ?? []).map(toViolation),
  };
}

export function sha256Hex(...parts: string[]): string {
  return createHash('sha256').update(parts.join('|')).digest('hex');
}

/**
 * Identificador interno determinístico no formato de 24 hex da API pública. Não é um
 * ObjectId oficial da Dynamox: serve apenas para manter o payload compatível e para que
 * seed, simulador e gateway derivem o mesmo id a partir da mesma entrada.
 */
export function deterministicResourceId(...parts: string[]): string {
  return sha256Hex(...parts).slice(0, 24);
}

/**
 * Timestamps aceitos são exclusivamente UTC canônico com milissegundos exatos.
 * O banco guarda TIMESTAMPTZ(3); precisão submilissegundo seria truncada em silêncio e
 * dois instantes distintos colidiriam na mesma linha.
 */
export const CANONICAL_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function isCanonicalMillisecondTimestamp(value: string): boolean {
  if (!CANONICAL_TIMESTAMP_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  // Descarta datas impossíveis (2026-02-30) e qualquer valor que não sobreviva ao
  // round-trip Date -> ISO, garantindo que o que é gravado é exatamente o que chegou.
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      sorted[key] = canonicalize(source[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Serialização canônica: chaves ordenadas recursivamente e JSON como único mecanismo de
 * separação. Nada de concatenar com "|" ou ":", que podem aparecer dentro dos próprios
 * valores e tornar duas entradas diferentes indistinguíveis para o hash.
 */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function measurementIdentity(measurement: TelemetryMeasurement): string {
  return canonicalJson([
    measurement.resourceId,
    measurement.attributes.physicalQuantity,
    measurement.attributes.axis ?? null,
    measurement.attributes.unit,
  ]);
}

/**
 * Fingerprint do conteúdo completo do ciclo: identificador e modelo do sistema de medição,
 * todas as medições com seus atributos e cada par timestamp/valor, além de metadata, tags
 * e configuration. Reordenar propriedades, medições, amostras ou tags não muda o resultado;
 * alterar qualquer valor, sim.
 */
export function computePayloadFingerprint(payload: TelemetryCyclePayload): string {
  const { telemetryCycleData, configuration } = payload;

  const measurements = telemetryCycleData.measurements
    .map((measurement) => ({
      resourceId: measurement.resourceId,
      attributes: measurement.attributes,
      dataPoints: [...measurement.dataPoints].sort((left, right) => {
        if (left.timestamp !== right.timestamp) {
          return left.timestamp < right.timestamp ? -1 : 1;
        }
        return left.value - right.value;
      }),
    }))
    .sort((left, right) => {
      const leftKey = measurementIdentity(left);
      const rightKey = measurementIdentity(right);
      if (leftKey !== rightKey) {
        return leftKey < rightKey ? -1 : 1;
      }
      return canonicalJson(left.dataPoints) < canonicalJson(right.dataPoints) ? -1 : 1;
    });

  const canonical = {
    telemetryCycleData: {
      measuringSystemUniqueIdentifier: telemetryCycleData.measuringSystemUniqueIdentifier,
      measuringSystemModel: telemetryCycleData.measuringSystemModel,
      measurements,
      metadata: telemetryCycleData.metadata,
      // tags são um conjunto: a ordem em que chegam não distingue dois ciclos.
      tags: [...telemetryCycleData.tags].sort(),
    },
    configuration,
  };

  return createHash('sha256').update(canonicalJson(canonical), 'utf8').digest('hex');
}

/**
 * ————— Ancoragem temporal dos DADOS DE DEMONSTRAÇÃO —————
 *
 * Seed e sensor twin geram amostras sintéticas. Se os instantes forem absolutos, eles
 * envelhecem: o painel filtra por janelas relativas ao relógio e, dias depois, o mesmo
 * comando produz um dashboard vazio (ou, antes da data, leituras "no futuro").
 *
 * A âncora é o início do bloco de 6 h em que a execução acontece. Duas propriedades:
 *  - **determinismo dentro do bloco**: qualquer comando rodado na mesma janela de 6 h
 *    calcula o MESMO instante, então o payload é idêntico, o fingerprint é idêntico e a
 *    reingestão é reconhecida como duplicata;
 *  - **sempre no passado e recente**: a âncora nunca é futura e fica, no pior caso, 6 h
 *    atrás — dentro da janela de recência do painel.
 *
 * `DEMO_DATA_ANCHOR` (ISO 8601) fixa a âncora explicitamente, para reproduzir uma
 * demonstração ou um teste em um instante conhecido.
 */
export const DEMO_ANCHOR_BLOCK_MS = 6 * 60 * 60 * 1000;
export const DEMO_ANCHOR_ENV = 'DEMO_DATA_ANCHOR';

export function demoAnchorMs(
  now: number = Date.now(),
  env: Record<string, string | undefined> = process.env,
): number {
  const override = env[DEMO_ANCHOR_ENV];
  if (override !== undefined && override.trim() !== '') {
    const parsed = Date.parse(override);
    if (!Number.isFinite(parsed)) {
      throw new Error(`${DEMO_ANCHOR_ENV} inválida: "${override}" não é uma data ISO 8601.`);
    }
    return parsed;
  }
  return Math.floor(now / DEMO_ANCHOR_BLOCK_MS) * DEMO_ANCHOR_BLOCK_MS;
}

/**
 * Instante canônico (UTC com milissegundos exatos) deslocado da âncora. Offsets negativos
 * apontam para o passado — é assim que as janelas da planta são posicionadas.
 */
export function demoWindowIso(
  offsetMs: number,
  now?: number,
  env?: Record<string, string | undefined>,
): string {
  return new Date(demoAnchorMs(now, env) + offsetMs).toISOString();
}

export const DEMO_HOUR_MS = 60 * 60 * 1000;

export const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._~:-]{1,128}$/;

export function isValidIdempotencyKey(value: string): boolean {
  return IDEMPOTENCY_KEY_PATTERN.test(value);
}
