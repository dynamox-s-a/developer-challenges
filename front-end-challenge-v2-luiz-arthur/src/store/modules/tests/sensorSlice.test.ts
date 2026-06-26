import { describe, it, expect } from 'vitest';
import sensorSlice, {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
  setHoveredTimestamp,
} from '../sensorSlice';
import type { SensorState } from '../../../types/sensor.types';

describe('sensorSlice', () => {
  const initialState: SensorState = {
    loading: false,
    error: null,
    allMetrics: [],
    acceleration: { x: null, y: null, z: null },
    velocity: { x: null, y: null, z: null },
    temperature: null,
    hoveredTimestamp: null,
  };

  it('should set loading to true on fetchDataRequest', () => {
    const state = sensorSlice(initialState, fetchDataRequest());
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should populate data on fetchDataSuccess', () => {
    const mockData = [
      { name: 'accelerationRms/x', data: [{ datetime: '2023-11-07T11:53:38.187Z', max: 0 }] },
      { name: 'accelerationRms/y', data: [] },
      { name: 'accelerationRms/z', data: [] },
      { name: 'velocityRms/x', data: [] },
      { name: 'velocityRms/y', data: [] },
      { name: 'velocityRms/z', data: [] },
      { name: 'temperature', data: [] },
    ];
    const state = sensorSlice(initialState, fetchDataSuccess(mockData));
    expect(state.loading).toBe(false);
    expect(state.acceleration.x).toEqual(mockData[0]);
    expect(state.temperature).toEqual(mockData[6]);
  });

  it('should set error on fetchDataFailure', () => {
    const state = sensorSlice(initialState, fetchDataFailure('Erro ao buscar dados'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Erro ao buscar dados');
  });

  it('should update hoveredTimestamp', () => {
    const timestamp = 1700000000000;
    const state = sensorSlice(initialState, setHoveredTimestamp(timestamp));
    expect(state.hoveredTimestamp).toBe(timestamp);
  });
});