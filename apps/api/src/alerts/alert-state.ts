/**
 * Tradução entre a linha `alert_rule_states` e o estado puro do motor. O registro guarda,
 * além do núcleo, as datas da janela de aprendizado — informação de relatório, não de decisão.
 */
import type { AlertEvaluationOutcome, AlertRuleState, Prisma } from '@prisma/client';

import type { StepOutcome, ThresholdState } from './core/types';

export interface StateRecord {
  id: string;
  ruleId: string;
  monitoringPointId: string;
  core: ThresholdState;
  baselineFrom: Date | null;
  baselineTo: Date | null;
  baselineEstablishedAt: Date | null;
}

const ms = (value: Date | null): number | null => (value === null ? null : value.getTime());
const date = (value: number | null): Date | null => (value === null ? null : new Date(value));

export function toStateRecord(row: AlertRuleState): StateRecord {
  return {
    id: row.id,
    ruleId: row.ruleId,
    monitoringPointId: row.monitoringPointId,
    core: {
      baselineStatus: row.baselineStatus === 'ESTABLISHED' ? 'established' : 'learning',
      baselineSensorId: row.baselineSensorId,
      learningCount: row.learningCount,
      baselineValue: row.baselineValue,
      baselineProfile: row.baselineProfile,
      baselineBinCounts: row.baselineBinCounts,
      aboveA1Streak: row.aboveA1Streak,
      aboveA2Streak: row.aboveA2Streak,
      belowClearStreak: row.belowClearStreak,
      suppressedUntilMs: ms(row.suppressedUntil),
      lastSeenAtMs: ms(row.lastSeenAt),
      lastEvaluatedAtMs: ms(row.lastEvaluatedAt),
      lastEvaluatedCycleId: row.lastEvaluatedCycleId,
      lastValue: row.lastValue,
      lastMeasure: row.lastMeasure,
    },
    baselineFrom: row.baselineFrom,
    baselineTo: row.baselineTo,
    baselineEstablishedAt: row.baselineEstablishedAt,
  };
}

export function stateUpdateData(record: StateRecord): Prisma.AlertRuleStateUncheckedUpdateInput {
  const { core } = record;
  return {
    baselineStatus: core.baselineStatus === 'established' ? 'ESTABLISHED' : 'LEARNING',
    baselineSensorId: core.baselineSensorId,
    learningCount: core.learningCount,
    baselineValue: core.baselineValue,
    baselineProfile: core.baselineProfile,
    baselineBinCounts: core.baselineBinCounts,
    baselineFrom: record.baselineFrom,
    baselineTo: record.baselineTo,
    baselineEstablishedAt: record.baselineEstablishedAt,
    aboveA1Streak: core.aboveA1Streak,
    aboveA2Streak: core.aboveA2Streak,
    belowClearStreak: core.belowClearStreak,
    suppressedUntil: date(core.suppressedUntilMs),
    lastSeenAt: date(core.lastSeenAtMs),
    lastEvaluatedAt: date(core.lastEvaluatedAtMs),
    lastEvaluatedCycleId: core.lastEvaluatedCycleId,
    lastValue: core.lastValue,
    lastMeasure: core.lastMeasure,
  };
}

export const OUTCOME_TO_PRISMA: Record<StepOutcome, AlertEvaluationOutcome> = {
  evaluated: 'EVALUATED',
  learning: 'LEARNING',
  suppressed: 'SUPPRESSED',
  'no-evidence': 'NO_EVIDENCE',
  'out-of-order': 'OUT_OF_ORDER',
};
