import type {
  AlertEventType,
  AlertLevel,
  AlertResolutionReason,
  AlertScope,
  AlertState,
  AlertThresholdMode,
  AlertType,
} from '@dynamox/domain';
import {
  AlertEventType as PrismaAlertEventType,
  AlertLevel as PrismaAlertLevel,
  AlertResolutionReason as PrismaAlertResolutionReason,
  AlertScope as PrismaAlertScope,
  AlertState as PrismaAlertState,
  AlertThresholdMode as PrismaAlertThresholdMode,
  AlertType as PrismaAlertType,
} from '@prisma/client';

/**
 * Tradução entre o vocabulário público de alertas (kebab-case, o que a API publica) e os
 * enums do Prisma (SCREAMING_CASE, internos). Bijeções totais: um valor do banco nunca vaza
 * para o contrato, e o contrato nunca depende de como o banco nomeia as coisas.
 */
function invert<A extends string, B extends string>(map: Record<A, B>): Record<B, A> {
  return Object.fromEntries(Object.entries(map).map(([a, b]) => [b, a])) as Record<B, A>;
}

const TYPE_TO_PRISMA: Record<AlertType, PrismaAlertType> = {
  'vibration-threshold': PrismaAlertType.VIBRATION_THRESHOLD,
  'temperature-threshold': PrismaAlertType.TEMPERATURE_THRESHOLD,
  'sensor-silent': PrismaAlertType.SENSOR_SILENT,
  'fleet-silent': PrismaAlertType.FLEET_SILENT,
};
const PRISMA_TO_TYPE = invert(TYPE_TO_PRISMA);

const LEVEL_TO_PRISMA: Record<AlertLevel, PrismaAlertLevel> = {
  A1: PrismaAlertLevel.A1,
  A2: PrismaAlertLevel.A2,
};
const PRISMA_TO_LEVEL = invert(LEVEL_TO_PRISMA);

const STATE_TO_PRISMA: Record<AlertState, PrismaAlertState> = {
  active: PrismaAlertState.ACTIVE,
  resolved: PrismaAlertState.RESOLVED,
};
const PRISMA_TO_STATE = invert(STATE_TO_PRISMA);

const EVENT_TO_PRISMA: Record<AlertEventType, PrismaAlertEventType> = {
  opened: PrismaAlertEventType.OPENED,
  escalated: PrismaAlertEventType.ESCALATED,
  acknowledged: PrismaAlertEventType.ACKNOWLEDGED,
  resolved: PrismaAlertEventType.RESOLVED,
};
const PRISMA_TO_EVENT = invert(EVENT_TO_PRISMA);

const SCOPE_TO_PRISMA: Record<AlertScope, PrismaAlertScope> = {
  point: PrismaAlertScope.POINT,
  fleet: PrismaAlertScope.FLEET,
};
const PRISMA_TO_SCOPE = invert(SCOPE_TO_PRISMA);

const MODE_TO_PRISMA: Record<AlertThresholdMode, PrismaAlertThresholdMode> = {
  'ratio-to-baseline': PrismaAlertThresholdMode.RATIO_TO_BASELINE,
  'delta-from-baseline': PrismaAlertThresholdMode.DELTA_FROM_BASELINE,
  'elapsed-intervals': PrismaAlertThresholdMode.ELAPSED_INTERVALS,
};
const PRISMA_TO_MODE = invert(MODE_TO_PRISMA);

const REASON_TO_PRISMA: Record<AlertResolutionReason, PrismaAlertResolutionReason> = {
  'condition-cleared': PrismaAlertResolutionReason.CONDITION_CLEARED,
  'telemetry-resumed': PrismaAlertResolutionReason.TELEMETRY_RESUMED,
};
const PRISMA_TO_REASON = invert(REASON_TO_PRISMA);

export const toPrismaAlertType = (value: AlertType): PrismaAlertType => TYPE_TO_PRISMA[value];
export const toDomainAlertType = (value: PrismaAlertType): AlertType => PRISMA_TO_TYPE[value];

export const toPrismaAlertLevel = (value: AlertLevel): PrismaAlertLevel => LEVEL_TO_PRISMA[value];
export const toDomainAlertLevel = (value: PrismaAlertLevel): AlertLevel => PRISMA_TO_LEVEL[value];

export const toPrismaAlertState = (value: AlertState): PrismaAlertState => STATE_TO_PRISMA[value];
export const toDomainAlertState = (value: PrismaAlertState): AlertState => PRISMA_TO_STATE[value];

export const toPrismaAlertEventType = (value: AlertEventType): PrismaAlertEventType =>
  EVENT_TO_PRISMA[value];
export const toDomainAlertEventType = (value: PrismaAlertEventType): AlertEventType =>
  PRISMA_TO_EVENT[value];

export const toPrismaAlertScope = (value: AlertScope): PrismaAlertScope => SCOPE_TO_PRISMA[value];
export const toDomainAlertScope = (value: PrismaAlertScope): AlertScope => PRISMA_TO_SCOPE[value];

export const toPrismaAlertThresholdMode = (value: AlertThresholdMode): PrismaAlertThresholdMode =>
  MODE_TO_PRISMA[value];
export const toDomainAlertThresholdMode = (value: PrismaAlertThresholdMode): AlertThresholdMode =>
  PRISMA_TO_MODE[value];

export const toPrismaAlertResolutionReason = (
  value: AlertResolutionReason,
): PrismaAlertResolutionReason => REASON_TO_PRISMA[value];
export const toDomainAlertResolutionReason = (
  value: PrismaAlertResolutionReason,
): AlertResolutionReason => PRISMA_TO_REASON[value];
