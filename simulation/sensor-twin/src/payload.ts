/**
 * Mapeamento das janelas para o contrato REAL de telemetria, agora parametrizado por
 * identidade (F3): a MESMA engine serve qualquer sensor do manifest — nada de
 * identidade de frota hardcoded.
 *
 * Modelo de identidades (plano v3.1 §3 — conceitos separados, nunca igualados):
 *   acquisitionIntentId  sim.<serial>.<scenario>.s<seed>.<janela>   (intenção)
 *   payloadFingerprint   computePayloadFingerprint (conteúdo; o MESMO do backend)
 *   artifactId           <intent>.<fp8>                             (intenção+versão)
 *   Idempotency-Key      = artifactId
 *   metadata.cycleId     = Idempotency-Key (o schema documenta cycleId como cópia
 *                          rastreável da chave)
 * A circularidade fingerprint↔cycleId é resolvida em DUAS passadas determinísticas:
 * fp8 é calculado com cycleId = intentId; depois cycleId recebe a chave final.
 */
import {
  computePayloadFingerprint,
  deterministicResourceId,
  isValidIdempotencyKey,
  validateTelemetryCycle,
  type TelemetryCyclePayload,
  type TelemetryMeasurement,
} from '@dynamox/contracts';
import type { SensorModel } from '@dynamox/domain';

import { generateStream } from './signal';
import { windowStream, type CycleWindows } from './windows';
import { TWIN_IDENTITY, getScenarioConfig, type ScenarioConfig } from './scenarios';

export interface SensorTwinIdentity {
  machineName: string;
  monitoringPointName: string;
  sensorSerial: string;
  /** Modelo/perfil público (HF+, TcAg, TcAs) — vira metadata.profile e tag de modelo. */
  sensorModel: SensorModel;
  /** resourceId JÁ RESOLVIDO (24 hex) do ponto monitorado. */
  resourceId: string;
}

/**
 * resourceId do ponto canônico do seed — derivado com a MESMA função e as MESMAS
 * entradas do seed do banco (nome da máquina + nome do ponto). 42d726ba…
 */
export function monitoringPointResourceId(): string {
  return deterministicResourceId(
    'dynamox-challenge',
    'monitoring-point',
    TWIN_IDENTITY.machineName,
    TWIN_IDENTITY.monitoringPointName,
  );
}

/** Identidade default: o sensor canônico single-sensor (P-101/SIM-HF-001). */
export const DEFAULT_IDENTITY: SensorTwinIdentity = Object.freeze({
  machineName: TWIN_IDENTITY.machineName,
  monitoringPointName: TWIN_IDENTITY.monitoringPointName,
  sensorSerial: TWIN_IDENTITY.sensorSerial,
  sensorModel: 'HF+',
  resourceId: monitoringPointResourceId(),
});

const MODEL_SLUGS: Record<SensorModel, string> = {
  'HF+': 'hf-plus',
  TcAg: 'tcag',
  TcAs: 'tcas',
};

/** Slug determinístico para tags: minúsculo, sem acentos, [a-z0-9-]. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Identidade da INTENÇÃO de aquisição — usada por orquestração/reconciliação. */
export function acquisitionIntentId(
  config: ScenarioConfig,
  identity: SensorTwinIdentity,
): string {
  const compactStart = config.baseTimestamp.replace(/[-:]/g, '').replace('.000Z', 'Z');
  return `sim.${identity.sensorSerial}.${config.scenario}.s${config.seed}.${compactStart}`;
}

/**
 * Extras ADITIVOS do ciclo — só entram nos objetos que o contrato declara abertos
 * (`metadata`, `configuration`, `tags`). Servem para proveniência adicional (ex.: a
 * verdade-terreno do histórico sintético). Nunca substituem uma chave canônica: quem
 * tentar recebe erro antes de o payload existir. Entram no fingerprint como qualquer
 * outro conteúdo — por isso precisam ser determinísticos.
 */
export interface CycleExtras {
  metadata?: Record<string, unknown>;
  tags?: string[];
  configuration?: Record<string, unknown>;
}

const RESERVED_METADATA_KEYS = ['origin', 'generator', 'profile', 'cycleId', 'seed', 'synthetic'];
const RESERVED_CONFIGURATION_KEYS = [
  'monitoringLocationMap',
  'rpm',
  'loadPercent',
  'scenario',
  'seed',
  'durationSeconds',
  'publishRateHz',
];

export function assertExtrasAreAdditive(extras: CycleExtras): void {
  const clashes: string[] = [];
  for (const key of Object.keys(extras.metadata ?? {})) {
    if (RESERVED_METADATA_KEYS.includes(key)) clashes.push(`metadata.${key}`);
  }
  for (const key of Object.keys(extras.configuration ?? {})) {
    if (RESERVED_CONFIGURATION_KEYS.includes(key)) clashes.push(`configuration.${key}`);
  }
  for (const tag of extras.tags ?? []) {
    if (typeof tag !== 'string' || tag.length === 0) clashes.push('tags: item vazio');
  }
  if (clashes.length > 0) {
    throw new Error(`Extras do ciclo tentaram sobrescrever chaves canônicas: ${clashes.join(', ')}.`);
  }
}

const DISPLAY_NAMES = {
  x: { pt: 'Aceleração RMS — eixo X', en: 'Acceleration RMS — X axis' },
  y: { pt: 'Aceleração RMS — eixo Y', en: 'Acceleration RMS — Y axis' },
  z: { pt: 'Aceleração RMS — eixo Z', en: 'Acceleration RMS — Z axis' },
  temperature: { pt: 'Temperatura do mancal', en: 'Bearing temperature' },
  rotationalSpeed: { pt: 'Rotação do eixo', en: 'Shaft rotational speed' },
} as const;

function dataPoints(timestamps: string[], values: number[]) {
  return timestamps.map((timestamp, index) => ({ timestamp, value: values[index] }));
}

export function buildCyclePayload(
  windows: CycleWindows,
  identity: SensorTwinIdentity,
  cycleId: string,
  extras: CycleExtras = {},
): TelemetryCyclePayload {
  assertExtrasAreAdditive(extras);
  const { config } = windows;
  const { resourceId } = identity;
  const canonicalTags = [
    'simulated',
    `asset:${slugify(identity.machineName)}`,
    `model:${MODEL_SLUGS[identity.sensorModel]}`,
    `scenario:${config.scenario}`,
  ];
  // Canônicas primeiro, extras depois, sem repetição — a ordem é estável por construção.
  const tags = [...new Set([...canonicalTags, ...(extras.tags ?? [])])];

  const accelerationMeasurement = (axis: 'x' | 'y' | 'z'): TelemetryMeasurement => ({
    resourceId,
    attributes: {
      physicalQuantity: 'acceleration',
      axis,
      unit: 'g',
      displayName: { ...DISPLAY_NAMES[axis] },
    },
    dataPoints: dataPoints(windows.windowTimestamps, windows.rmsG[axis]),
  });

  const payload: TelemetryCyclePayload = {
    telemetryCycleData: {
      measuringSystemUniqueIdentifier: identity.sensorSerial,
      measuringSystemModel: { name: TWIN_IDENTITY.generatorName, version: 1 },
      measurements: [
        accelerationMeasurement('x'),
        accelerationMeasurement('y'),
        accelerationMeasurement('z'),
        {
          resourceId,
          attributes: {
            physicalQuantity: 'temperature',
            unit: 'degC',
            displayName: { ...DISPLAY_NAMES.temperature },
          },
          dataPoints: dataPoints(windows.windowTimestamps, windows.temperaturesC),
        },
        {
          resourceId,
          attributes: {
            physicalQuantity: 'rotationalSpeed',
            unit: 'rpm',
            displayName: { ...DISPLAY_NAMES.rotationalSpeed },
          },
          dataPoints: dataPoints(windows.windowTimestamps, windows.rpms),
        },
      ],
      metadata: {
        ...(extras.metadata ?? {}),
        origin: 'simulation',
        generator: {
          name: TWIN_IDENTITY.generatorName,
          version: TWIN_IDENTITY.generatorVersion,
        },
        profile: identity.sensorModel,
        cycleId,
        seed: config.seed,
        synthetic: true,
      },
      tags,
    },
    configuration: {
      ...(extras.configuration ?? {}),
      monitoringLocationMap: [
        {
          mapLabel: `${identity.machineName} / ${identity.monitoringPointName}`,
          mapValue: resourceId,
        },
      ],
      rpm: config.rpm,
      loadPercent: config.loadPercent,
      scenario: config.scenario,
      seed: config.seed,
      durationSeconds: config.durationSeconds,
      publishRateHz: 1 / config.windowSeconds,
    },
  };

  // Falhar aqui, alto e cedo: um ciclo que não valida no Ajv REAL nunca sai do gerador.
  const result = validateTelemetryCycle(payload);
  if (!result.valid) {
    const details = result.violations
      .map((violation) => `${violation.path}: ${violation.message}`)
      .join('; ');
    throw new Error(`Ciclo sintético violou o contrato interno: ${details}`);
  }

  return result.payload;
}

export interface BuiltCycle {
  config: ScenarioConfig;
  identity: SensorTwinIdentity;
  payload: TelemetryCyclePayload;
  /** Intenção da aquisição (sem versão de conteúdo). */
  acquisitionIntentId: string;
  /** artifactId = intent.fp8 — é o que viaja como Idempotency-Key. */
  idempotencyKey: string;
  /** Fingerprint canônico da APLICAÇÃO sobre o payload FINAL. */
  fingerprint: string;
}

/** Cenário + identidade → stream → janelas → payload validado, determinístico. */
export function buildCycle(
  scenario: unknown,
  overrides: Partial<Omit<ScenarioConfig, 'scenario'>> = {},
  identity: SensorTwinIdentity = DEFAULT_IDENTITY,
  extras: CycleExtras = {},
): BuiltCycle {
  const config = getScenarioConfig(scenario, overrides);
  const windows = windowStream(generateStream(config));

  const intentId = acquisitionIntentId(config, identity);
  // 1ª passada: cycleId = intenção → fingerprint de versão do conteúdo.
  const draft = buildCyclePayload(windows, identity, intentId, extras);
  const fp8 = computePayloadFingerprint(draft).slice(0, 8);

  const idempotencyKey = `${intentId}.${fp8}`;
  if (!isValidIdempotencyKey(idempotencyKey)) {
    throw new Error(`Idempotency-Key gerada fora do contrato da API: "${idempotencyKey}"`);
  }

  // 2ª passada: cycleId = chave final (cópia rastreável, como o schema documenta).
  const payload = buildCyclePayload(windows, identity, idempotencyKey, extras);

  return {
    config,
    identity,
    payload,
    acquisitionIntentId: intentId,
    idempotencyKey,
    fingerprint: computePayloadFingerprint(payload),
  };
}
