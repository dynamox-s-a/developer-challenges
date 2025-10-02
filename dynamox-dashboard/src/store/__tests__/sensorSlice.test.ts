import { describe, it, expect } from 'vitest';
import sensorReducer, {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
} from '../sensorSlice';
import type { SensorState, SensorData } from '../../types/sensor';

const initialState: SensorState = {
  loading: false,
  error: null,
  data: [],
};

const mockSensorData: SensorData[] = [
  {
    name: 'Acceleration Sensor 1',
    data: [
      { datetime: '2024-01-01T00:00:00Z', max: 10.5 },
      { datetime: '2024-01-01T01:00:00Z', max: 12.3 },
    ],
  },
  {
    name: 'Velocity Sensor 1',
    data: [
      { datetime: '2024-01-01T00:00:00Z', max: 25.0 },
      { datetime: '2024-01-01T01:00:00Z', max: 27.8 },
    ],
  },
];

describe('sensorSlice', () => {
  it('should return initial state', () => {
    const result = sensorReducer(undefined, { type: 'unknown' });
    
    expect(result).toEqual(initialState);
  });

  it('should handle fetchDataRequest', () => {
    const result = sensorReducer(initialState, fetchDataRequest());
    
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
  });

  it('should handle fetchDataSuccess', () => {
    const state = { ...initialState, loading: true };
    const result = sensorReducer(state, fetchDataSuccess(mockSensorData));
    
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockSensorData);
  });

  it('should handle fetchDataFailure', () => {
    const state = { ...initialState, loading: true };
    const errorMessage = 'Network error';
    const result = sensorReducer(state, fetchDataFailure(errorMessage));
    
    expect(result.loading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.data).toEqual([]);
  });

  it('should clear error when starting new request', () => {
    const state = {
      ...initialState,
      error: 'Previous error',
      data: mockSensorData,
    };
    const result = sensorReducer(state, fetchDataRequest());
    
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockSensorData);
  });
});
