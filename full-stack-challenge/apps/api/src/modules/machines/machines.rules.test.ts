import { describe, expect, it } from 'vitest';
import {
  MachineType,
  SensorModel,
  isSensorAllowedForMachine,
} from '@dynamox/shared';

describe('isSensorAllowedForMachine', () => {
  it('blocks TcAg and TcAs on Pump machines', () => {
    expect(isSensorAllowedForMachine(MachineType.Pump, SensorModel.TcAg)).toBe(false);
    expect(isSensorAllowedForMachine(MachineType.Pump, SensorModel.TcAs)).toBe(false);
    expect(isSensorAllowedForMachine(MachineType.Pump, SensorModel.HFPlus)).toBe(true);
  });

  it('allows all sensor models on Fan machines', () => {
    expect(isSensorAllowedForMachine(MachineType.Fan, SensorModel.TcAg)).toBe(true);
    expect(isSensorAllowedForMachine(MachineType.Fan, SensorModel.TcAs)).toBe(true);
    expect(isSensorAllowedForMachine(MachineType.Fan, SensorModel.HFPlus)).toBe(true);
  });
});
