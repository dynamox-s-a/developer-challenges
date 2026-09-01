/** Linha do banco → DTO público. Os enums passam pelo mapper; datas viram ISO; ACK vira status derivado. */
import type { AlertEvent, AlertRuleState, Prisma } from '@prisma/client';

import {
  type AlertBaselineDto,
  type AlertEventDto,
  type AlertOccurrenceDto,
  alertFamily,
  deriveAlertStatus,
} from '@dynamox/domain';

import {
  toDomainAlertEventType,
  toDomainAlertLevel,
  toDomainAlertResolutionReason,
  toDomainAlertScope,
  toDomainAlertState,
  toDomainAlertThresholdMode,
  toDomainAlertType,
} from '../common/alert.mapper';
import { toDomainMachineType } from '../common/machine-type.mapper';
import { toDomainSensorModel } from '../common/sensor-model.mapper';

export const OCCURRENCE_INCLUDE = {
  rule: true,
  machine: { select: { type: true } },
  sensor: { select: { model: true } },
} satisfies Prisma.AlertOccurrenceInclude;

export type OccurrenceRow = Prisma.AlertOccurrenceGetPayload<{ include: typeof OCCURRENCE_INCLUDE }>;

const iso = (value: Date | null): string | null => (value ? value.toISOString() : null);

export function toAlertOccurrenceDto(row: OccurrenceRow): AlertOccurrenceDto {
  const type = toDomainAlertType(row.type);
  const state = toDomainAlertState(row.state);
  return {
    id: row.id,
    ruleId: row.ruleId,
    ruleKey: row.rule.key,
    type,
    family: alertFamily(type),
    scope: toDomainAlertScope(row.scope),
    level: toDomainAlertLevel(row.level),
    state,
    status: deriveAlertStatus(state, iso(row.acknowledgedAt)),
    machineId: row.machineId,
    machineName: row.machineName,
    machineType: row.machine ? toDomainMachineType(row.machine.type) : null,
    monitoringPointId: row.monitoringPointId,
    monitoringPointName: row.monitoringPointName,
    sensorId: row.sensorId,
    sensorSerialNumber: row.sensorSerialNumber,
    sensorModel: row.sensor ? toDomainSensorModel(row.sensor.model) : null,
    openedAt: row.openedAt.toISOString(),
    lastEvaluatedAt: row.lastEvaluatedAt.toISOString(),
    acknowledgedAt: iso(row.acknowledgedAt),
    acknowledgedBy: row.acknowledgedByEmail,
    acknowledgedLevel: row.acknowledgedLevel ? toDomainAlertLevel(row.acknowledgedLevel) : null,
    acknowledgeNote: row.acknowledgeNote,
    resolvedAt: iso(row.resolvedAt),
    resolutionReason: row.resolutionReason ? toDomainAlertResolutionReason(row.resolutionReason) : null,
    metric: row.metric,
    unit: row.unit,
    thresholdMode: toDomainAlertThresholdMode(row.thresholdMode),
    trigger: {
      cycleId: row.triggerCycleId,
      at: row.triggerAt.toISOString(),
      value: row.triggerValue,
      baseline: row.triggerBaseline,
      measure: row.triggerMeasure,
      threshold: row.triggerThreshold,
      consecutiveEvaluations: row.consecutiveEvaluations,
    },
    peak: { cycleId: row.peakCycleId, at: iso(row.peakAt), value: row.peakValue, baseline: null, measure: row.peakMeasure },
    last: { cycleId: row.lastCycleId, at: row.lastEvaluatedAt.toISOString(), value: row.lastValue, baseline: null, measure: row.lastMeasure },
    affectedCount: row.affectedCount,
    policyVersion: row.policyVersion,
  };
}

export function toAlertEventDto(row: AlertEvent): AlertEventDto {
  return {
    id: row.id,
    type: toDomainAlertEventType(row.type),
    fromState: row.fromState ? toDomainAlertState(row.fromState) : null,
    toState: toDomainAlertState(row.toState),
    fromLevel: row.fromLevel ? toDomainAlertLevel(row.fromLevel) : null,
    toLevel: row.toLevel ? toDomainAlertLevel(row.toLevel) : null,
    occurredAt: row.occurredAt.toISOString(),
    cycleId: row.cycleId,
    value: row.value,
    measure: row.measure,
    threshold: row.threshold,
    actor: row.actorEmail,
    note: row.note,
  };
}

/** Estado do motor → a baseline que a interface mostra. Só a parte que explica o alerta. */
export function toAlertBaselineDto(state: AlertRuleState, sensorSerialNumber: string | null): AlertBaselineDto {
  const bins = state.baselineBinCounts;
  return {
    status: state.baselineStatus === 'ESTABLISHED' ? 'established' : 'learning',
    value: state.baselineValue,
    learningCycles: state.learningCount,
    learnedFrom: iso(state.baselineFrom),
    learnedTo: iso(state.baselineTo),
    establishedAt: iso(state.baselineEstablishedAt),
    minBinCount: bins.length > 0 ? Math.min(...bins) : null,
    maxBinCount: bins.length > 0 ? Math.max(...bins) : null,
    sensorSerialNumber,
  };
}
