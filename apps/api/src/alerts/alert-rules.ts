import {
  ALERT_POLICY_V1_RULES,
  alertFamily,
  type AlertRuleDefinition,
  type AlertRuleDto,
} from '@dynamox/domain';
import type { AlertRule, PrismaClient } from '@prisma/client';

import {
  toDomainAlertThresholdMode,
  toDomainAlertType,
  toPrismaAlertThresholdMode,
  toPrismaAlertType,
} from '../common/alert.mapper';

/** O que o motor precisa de uma regra — a linha do banco já traduzida para o vocabulário público. */
export type RuleRecord = AlertRuleDto;

export function toRuleRecord(row: AlertRule): RuleRecord {
  const type = toDomainAlertType(row.type);
  return {
    id: row.id,
    key: row.key,
    type,
    family: alertFamily(type),
    enabled: row.enabled,
    metric: row.metric,
    unit: row.unit,
    thresholdMode: toDomainAlertThresholdMode(row.thresholdMode),
    a1Threshold: row.a1Threshold,
    a2Threshold: row.a2Threshold,
    clearThreshold: row.clearThreshold,
    consecutiveTrigger: row.consecutiveTrigger,
    consecutiveClear: row.consecutiveClear,
    learningCycles: row.learningCycles,
    minBinCount: row.minBinCount,
    expectedIntervalSeconds: row.expectedIntervalSeconds,
    postGapSuppressionMinutes: row.postGapSuppressionMinutes,
    fleetCollapseFraction: row.fleetCollapseFraction,
    policyVersion: row.policyVersion,
  };
}

/** Cliente mínimo aceito — o `PrismaClient` da aplicação ou o de um CLI. */
type RulesClient = Pick<PrismaClient, 'alertRule'>;

/**
 * Garante que as regras da política v1 existam. CREATE-ONLY de propósito: uma regra já
 * cadastrada não é sobrescrita, para que uma edição posterior de limiar sobreviva a um
 * restart — mudar a política no código é uma versão nova, não um "update" silencioso.
 */
export async function ensureAlertRules(
  prisma: RulesClient,
  definitions: readonly AlertRuleDefinition[] = ALERT_POLICY_V1_RULES,
): Promise<RuleRecord[]> {
  const records: RuleRecord[] = [];
  for (const definition of definitions) {
    const row = await prisma.alertRule.upsert({
      where: { key: definition.key },
      update: {},
      create: {
        key: definition.key,
        type: toPrismaAlertType(definition.type),
        enabled: definition.enabled,
        metric: definition.metric,
        unit: definition.unit,
        thresholdMode: toPrismaAlertThresholdMode(definition.thresholdMode),
        a1Threshold: definition.a1Threshold,
        a2Threshold: definition.a2Threshold,
        clearThreshold: definition.clearThreshold,
        consecutiveTrigger: definition.consecutiveTrigger,
        consecutiveClear: definition.consecutiveClear,
        learningCycles: definition.learningCycles,
        minBinCount: definition.minBinCount,
        expectedIntervalSeconds: definition.expectedIntervalSeconds,
        postGapSuppressionMinutes: definition.postGapSuppressionMinutes,
        fleetCollapseFraction: definition.fleetCollapseFraction,
        policyVersion: definition.policyVersion,
      },
    });
    records.push(toRuleRecord(row));
  }
  return records;
}

/** Regras habilitadas, na ordem estável em que o motor as aplica. */
export async function loadEnabledRules(prisma: RulesClient): Promise<RuleRecord[]> {
  const rows = await prisma.alertRule.findMany({ where: { enabled: true }, orderBy: { key: 'asc' } });
  return rows.map(toRuleRecord);
}
