/**
 * Proveniência da aquisição confirmatória (F8).
 *
 * F8 NÃO é outro simulador e NÃO representa a frota: pega a aquisição CONFIRMATÓRIA
 * escolhida pelo supervisor e prova que ela pode virar um artefato ROS portátil e ser
 * reconstruída sem mudar de identidade semântica. A identidade é o payloadFingerprint
 * recomputado sobre o payload reconstruído — nunca bytes do arquivo .bag.
 *
 * Formato intermediário: JSONL determinístico (canonicalJson por linha) com três tipos
 * de registro — `acquisition` (contexto completo, verbatim do payload), `series`
 * (atributos de cada medição) e `sample` (um datapoint). O artefato é autocontido:
 * a reconstrução monta o payload SÓ com o que está nos registros, zero engine.
 *
 * origin = simulation é obrigatório e verificado: replay ROS jamais pode fazer o
 * artefato parecer aquisição física. Nenhum segredo/token entra no artefato.
 */
import {
  canonicalJson,
  validateTelemetryCycle,
  type TelemetryCyclePayload,
  type TelemetryMeasurement,
} from '@dynamox/contracts';
import type { MachineType } from '@dynamox/domain';

import { slugify, type BuiltCycle } from './payload';

export const PROVENANCE_FORMAT = 'dynamox-sim-provenance';
export const PROVENANCE_VERSION = 1;

export interface RosTopicPlan {
  /** Namespace dos tópicos do sensor, ex.: sensors/sim_hf_002. */
  sensorNamespace: string;
  /** Tópico de rotação da máquina, ex.: pump_p101 (→ /pump_p101/rpm). */
  machineTopic: string;
  /** frame_id dos headers ROS. */
  frameId: string;
}

export interface AcquisitionRecord {
  type: 'acquisition';
  format: typeof PROVENANCE_FORMAT;
  formatVersion: typeof PROVENANCE_VERSION;
  origin: 'simulation';
  acquisitionIntentId: string;
  idempotencyKey: string;
  /** Evidência declarada para auditoria; a prova SEMPRE recomputa o fingerprint. */
  declaredFingerprint: string;
  identity: {
    machineName: string;
    machineType: MachineType;
    monitoringPointName: string;
    sensorSerial: string;
    sensorModel: string;
    resourceId: string;
  };
  ros: RosTopicPlan;
  /** Blocos do payload reproduzidos VERBATIM — necessários ao fingerprint idêntico. */
  telemetry: {
    measuringSystemUniqueIdentifier: string;
    measuringSystemModel: { name: string; version: number };
    metadata: TelemetryCyclePayload['telemetryCycleData']['metadata'];
    tags: string[];
    configuration: TelemetryCyclePayload['configuration'];
  };
}

export interface SeriesRecord {
  type: 'series';
  index: number;
  resourceId: string;
  attributes: TelemetryMeasurement['attributes'];
}

export interface SampleRecord {
  type: 'sample';
  series: number;
  timestamp: string;
  value: number;
}

export type ProvenanceRecord = AcquisitionRecord | SeriesRecord | SampleRecord;

const RECORD_KEYS: Record<ProvenanceRecord['type'], readonly string[]> = {
  acquisition: [
    'type', 'format', 'formatVersion', 'origin', 'acquisitionIntentId', 'idempotencyKey',
    'declaredFingerprint', 'identity', 'ros', 'telemetry',
  ],
  series: ['type', 'index', 'resourceId', 'attributes'],
  sample: ['type', 'series', 'timestamp', 'value'],
};

/** Tópicos ROS derivados da identidade — só o necessário para representar a aquisição. */
export function rosTopicPlan(machineName: string, machineType: MachineType, sensorSerial: string): RosTopicPlan {
  const sensorSlug = slugify(sensorSerial).replace(/-/g, '_');
  // 'P-101' → p101; 'VE-201 — Ventilador…' → ve201 (token do tag antes do primeiro espaço).
  const machineTag = slugify(machineName.split(/\s/)[0]).replace(/-/g, '');
  return {
    sensorNamespace: `sensors/${sensorSlug}`,
    machineTopic: `${machineType.toLowerCase()}_${machineTag}`,
    frameId: sensorSlug,
  };
}

/**
 * Registros canônicos da aquisição: 1 acquisition + 1 series por medição + 1 sample por
 * datapoint, em ordem determinística (série asc, timestamp asc).
 */
export function acquisitionRecords(cycle: BuiltCycle, machineType: MachineType): ProvenanceRecord[] {
  const data = cycle.payload.telemetryCycleData;
  if (data.metadata.origin !== 'simulation') {
    throw new Error(`Aquisição com origin "${data.metadata.origin}" não é exportável como proveniência sintética.`);
  }

  const acquisition: AcquisitionRecord = {
    type: 'acquisition',
    format: PROVENANCE_FORMAT,
    formatVersion: PROVENANCE_VERSION,
    origin: 'simulation',
    acquisitionIntentId: cycle.acquisitionIntentId,
    idempotencyKey: cycle.idempotencyKey,
    declaredFingerprint: cycle.fingerprint,
    identity: {
      machineName: cycle.identity.machineName,
      machineType,
      monitoringPointName: cycle.identity.monitoringPointName,
      sensorSerial: cycle.identity.sensorSerial,
      sensorModel: cycle.identity.sensorModel,
      resourceId: cycle.identity.resourceId,
    },
    ros: rosTopicPlan(cycle.identity.machineName, machineType, cycle.identity.sensorSerial),
    telemetry: {
      measuringSystemUniqueIdentifier: data.measuringSystemUniqueIdentifier,
      measuringSystemModel: data.measuringSystemModel,
      metadata: data.metadata,
      tags: data.tags,
      configuration: cycle.payload.configuration,
    },
  };

  const series: SeriesRecord[] = data.measurements.map((measurement, index) => ({
    type: 'series',
    index,
    resourceId: measurement.resourceId,
    attributes: measurement.attributes,
  }));

  const samples: SampleRecord[] = data.measurements.flatMap((measurement, index) =>
    [...measurement.dataPoints]
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0))
      .map((point) => ({
        type: 'sample' as const,
        series: index,
        timestamp: point.timestamp,
        value: point.value,
      })),
  );

  return [acquisition, ...series, ...samples];
}

/** JSONL canônico: uma linha canonicalJson por registro, newline no fim. */
export function serializeProvenance(records: ProvenanceRecord[]): string {
  return records.map((record) => canonicalJson(record)).join('\n') + '\n';
}

function assertKnownKeys(record: Record<string, unknown>, line: number): asserts record is Record<string, unknown> {
  const type = record.type;
  if (type !== 'acquisition' && type !== 'series' && type !== 'sample') {
    throw new Error(`Proveniência inválida (linha ${line}): tipo de registro desconhecido "${String(type)}".`);
  }
  const allowed = RECORD_KEYS[type];
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) {
      throw new Error(`Proveniência inválida (linha ${line}): campo inesperado "${key}" em registro ${type}.`);
    }
  }
}

/** Parse estrito do JSONL: tipos conhecidos, campos permitidos, nada além. */
export function parseProvenance(jsonl: string): ProvenanceRecord[] {
  const lines = jsonl.split('\n').filter((line) => line.trim().length > 0);
  return lines.map((line, i) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`Proveniência inválida (linha ${i + 1}): não é JSON.`);
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`Proveniência inválida (linha ${i + 1}): registro precisa ser objeto.`);
    }
    const record = parsed as Record<string, unknown>;
    assertKnownKeys(record, i + 1);
    return record as unknown as ProvenanceRecord;
  });
}

/**
 * Reconstrução: registros → payload de telemetria COMPLETO, validado no Ajv REAL dos
 * contratos. Recusa alto qualquer artefato que não declare origin = simulation nas duas
 * camadas (registro e metadata do payload) — replay nunca vira "aquisição física".
 */
export function payloadFromRecords(records: ProvenanceRecord[]): {
  payload: TelemetryCyclePayload;
  acquisition: AcquisitionRecord;
} {
  const acquisitions = records.filter((r): r is AcquisitionRecord => r.type === 'acquisition');
  if (acquisitions.length !== 1) {
    throw new Error(`Proveniência inválida: esperado exatamente 1 registro acquisition, há ${acquisitions.length}.`);
  }
  const acquisition = acquisitions[0];
  if (acquisition.format !== PROVENANCE_FORMAT || acquisition.formatVersion !== PROVENANCE_VERSION) {
    throw new Error(
      `Proveniência inválida: formato "${acquisition.format}" v${acquisition.formatVersion} não suportado.`,
    );
  }
  if (acquisition.origin !== 'simulation' || acquisition.telemetry.metadata.origin !== 'simulation') {
    throw new Error(
      'Replay recusado: o artefato não declara origin = simulation — proveniência sintética é obrigatória.',
    );
  }

  const series = records
    .filter((r): r is SeriesRecord => r.type === 'series')
    .sort((a, b) => a.index - b.index);
  if (series.length === 0) {
    throw new Error('Proveniência inválida: nenhum registro series.');
  }
  series.forEach((s, i) => {
    if (s.index !== i) throw new Error(`Proveniência inválida: índices de série não contíguos (esperado ${i}, veio ${s.index}).`);
  });

  const samplesBySeries = new Map<number, SampleRecord[]>(series.map((s) => [s.index, []]));
  for (const record of records) {
    if (record.type !== 'sample') continue;
    const bucket = samplesBySeries.get(record.series);
    if (!bucket) throw new Error(`Proveniência inválida: sample aponta série inexistente ${record.series}.`);
    bucket.push(record);
  }

  const measurements: TelemetryMeasurement[] = series.map((s) => {
    const samples = samplesBySeries.get(s.index)!;
    if (samples.length === 0) {
      throw new Error(`Proveniência inválida: série ${s.index} não tem amostras.`);
    }
    return {
      resourceId: s.resourceId,
      attributes: s.attributes,
      dataPoints: [...samples]
        .sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : a.value - b.value))
        .map((sample) => ({ timestamp: sample.timestamp, value: sample.value })),
    };
  });

  const payload: TelemetryCyclePayload = {
    telemetryCycleData: {
      measuringSystemUniqueIdentifier: acquisition.telemetry.measuringSystemUniqueIdentifier,
      measuringSystemModel: acquisition.telemetry.measuringSystemModel,
      measurements,
      metadata: acquisition.telemetry.metadata,
      tags: acquisition.telemetry.tags,
    },
    configuration: acquisition.telemetry.configuration,
  };

  const result = validateTelemetryCycle(payload);
  if (!result.valid) {
    const details = result.violations.map((v) => `${v.path}: ${v.message}`).join('; ');
    throw new Error(`Payload reconstruído violou o contrato real: ${details}`);
  }

  return { payload: result.payload, acquisition };
}
