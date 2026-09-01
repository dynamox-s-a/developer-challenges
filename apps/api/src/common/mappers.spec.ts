/**
 * Unitários dos mapeadores de vocabulário: a tradução público ↔ interno precisa ser uma
 * bijeção total, senão um enum do banco vazaria para a API (ou vice-versa).
 */
import {
  AlertEventType,
  AlertLevel,
  AlertResolutionReason,
  AlertScope,
  AlertState,
  AlertThresholdMode,
  AlertType,
  MachineType,
  SensorModel,
} from '@prisma/client';

import {
  ALERT_EVENT_TYPES,
  ALERT_LEVELS,
  ALERT_RESOLUTION_REASONS,
  ALERT_SCOPES,
  ALERT_STATES,
  ALERT_THRESHOLD_MODES,
  ALERT_TYPES,
  MACHINE_TYPES,
  SENSOR_MODELS,
} from '@dynamox/domain';

import {
  toDomainAlertEventType,
  toDomainAlertLevel,
  toDomainAlertResolutionReason,
  toDomainAlertScope,
  toDomainAlertState,
  toDomainAlertThresholdMode,
  toDomainAlertType,
  toPrismaAlertEventType,
  toPrismaAlertLevel,
  toPrismaAlertResolutionReason,
  toPrismaAlertScope,
  toPrismaAlertState,
  toPrismaAlertThresholdMode,
  toPrismaAlertType,
} from './alert.mapper';
import { toDomainMachineType, toPrismaMachineType } from './machine-type.mapper';
import { toDomainSensorModel, toPrismaSensorModel } from './sensor-model.mapper';

describe('mapeadores de vocabulário público ↔ enum do banco', () => {
  it('tipo de máquina: ida e volta cobrem todos os valores dos dois lados', () => {
    for (const publicType of MACHINE_TYPES) {
      expect(toDomainMachineType(toPrismaMachineType(publicType))).toBe(publicType);
    }
    for (const prismaType of Object.values(MachineType)) {
      expect(toPrismaMachineType(toDomainMachineType(prismaType))).toBe(prismaType);
    }
  });

  it('modelo de sensor: ida e volta cobrem todos os valores, incluindo HF+ ↔ HF_PLUS', () => {
    for (const publicModel of SENSOR_MODELS) {
      expect(toDomainSensorModel(toPrismaSensorModel(publicModel))).toBe(publicModel);
    }
    for (const prismaModel of Object.values(SensorModel)) {
      expect(toPrismaSensorModel(toDomainSensorModel(prismaModel))).toBe(prismaModel);
    }
    expect(toPrismaSensorModel('HF+')).toBe('HF_PLUS');
  });

  it('alertas: cada vocabulário público ↔ enum do banco é uma bijeção total', () => {
    const roundTrips: Array<[readonly string[], object, (v: never) => string, (v: never) => string]> = [
      [ALERT_TYPES, AlertType, toPrismaAlertType as never, toDomainAlertType as never],
      [ALERT_LEVELS, AlertLevel, toPrismaAlertLevel as never, toDomainAlertLevel as never],
      [ALERT_STATES, AlertState, toPrismaAlertState as never, toDomainAlertState as never],
      [ALERT_EVENT_TYPES, AlertEventType, toPrismaAlertEventType as never, toDomainAlertEventType as never],
      [ALERT_SCOPES, AlertScope, toPrismaAlertScope as never, toDomainAlertScope as never],
      [ALERT_THRESHOLD_MODES, AlertThresholdMode, toPrismaAlertThresholdMode as never, toDomainAlertThresholdMode as never],
      [ALERT_RESOLUTION_REASONS, AlertResolutionReason, toPrismaAlertResolutionReason as never, toDomainAlertResolutionReason as never],
    ];
    for (const [publicValues, prismaEnum, toPrisma, toDomain] of roundTrips) {
      for (const value of publicValues) {
        expect(toDomain(toPrisma(value as never) as never)).toBe(value);
      }
      for (const value of Object.values(prismaEnum) as string[]) {
        expect(toPrisma(toDomain(value as never) as never)).toBe(value);
      }
      expect(publicValues).toHaveLength(Object.values(prismaEnum).length);
    }
  });
});
