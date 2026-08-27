import { describe, expect, it } from 'vitest';
import {
  MachineType,
  SensorModel,
  isSensorAllowedForMachine,
} from '@dynamox/shared';

const ALL_MODELS = [SensorModel.TcAg, SensorModel.TcAs, SensorModel.HFPlus];

function getAllowedSensorModels(machineType: MachineType): SensorModel[] {
  return ALL_MODELS.filter((model) => isSensorAllowedForMachine(machineType, model));
}

describe('getAllowedSensorModels', () => {
  it('only allows HF+ for Pump machines', () => {
    expect(getAllowedSensorModels(MachineType.Pump)).toEqual([SensorModel.HFPlus]);
  });

  it('allows all models for Fan machines', () => {
    expect(getAllowedSensorModels(MachineType.Fan)).toEqual(ALL_MODELS);
  });
});
