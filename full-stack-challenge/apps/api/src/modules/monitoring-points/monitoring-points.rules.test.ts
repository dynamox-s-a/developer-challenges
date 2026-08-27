import { describe, expect, it } from 'vitest';
import { MachineType, SensorModel } from '@prisma/client';
import { SensorModel as SharedSensorModel } from '@dynamox/shared';
import {
  assertSensorAllowedForMachine,
  toPrismaSensorModel,
  toSharedSensorModel,
} from './monitoring-points.mappers';

describe('monitoring point sensor rules', () => {
  it('maps shared HF+ to Prisma HFPlus and back', () => {
    expect(toPrismaSensorModel[SharedSensorModel.HFPlus]).toBe(SensorModel.HFPlus);
    expect(toSharedSensorModel[SensorModel.HFPlus]).toBe(SharedSensorModel.HFPlus);
  });

  it('rejects TcAg/TcAs on Pump and allows HF+', () => {
    expect(assertSensorAllowedForMachine(MachineType.Pump, SharedSensorModel.TcAg)).toBe(
      false
    );
    expect(assertSensorAllowedForMachine(MachineType.Pump, SharedSensorModel.TcAs)).toBe(
      false
    );
    expect(assertSensorAllowedForMachine(MachineType.Pump, SharedSensorModel.HFPlus)).toBe(
      true
    );
  });

  it('allows all models on Fan', () => {
    expect(assertSensorAllowedForMachine(MachineType.Fan, SharedSensorModel.TcAg)).toBe(true);
    expect(assertSensorAllowedForMachine(MachineType.Fan, SharedSensorModel.TcAs)).toBe(true);
    expect(assertSensorAllowedForMachine(MachineType.Fan, SharedSensorModel.HFPlus)).toBe(
      true
    );
  });
});
