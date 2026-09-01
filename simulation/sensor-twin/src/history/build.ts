/** HistoryJob → ciclo pronto para o POST. Puro: usado pelo driver, pelos workers e pelos testes. */
import { buildCycle, type CycleExtras, type SensorTwinIdentity } from '../payload';
import type { HistoryOverrides } from './narrative';
import type { HistorySlot } from './schedule';

export interface HistoryJob {
  jobId: number;
  slot: HistorySlot;
  identity: SensorTwinIdentity;
  overrides: HistoryOverrides;
  extras: CycleExtras;
}

export interface GeneratedCycle {
  jobId: number;
  slot: HistorySlot;
  idempotencyKey: string;
  fingerprint: string;
  /** Corpo já serializado: o POST não volta a stringificar. */
  body: string;
  sampleCount: number;
}

export function buildHistoryCycle(job: HistoryJob): GeneratedCycle {
  const cycle = buildCycle('normal', job.overrides, job.identity, job.extras);
  const sampleCount = cycle.payload.telemetryCycleData.measurements.reduce((sum, m) => sum + m.dataPoints.length, 0);
  return {
    jobId: job.jobId,
    slot: job.slot,
    idempotencyKey: cycle.idempotencyKey,
    fingerprint: cycle.fingerprint,
    body: JSON.stringify(cycle.payload),
    sampleCount,
  };
}
