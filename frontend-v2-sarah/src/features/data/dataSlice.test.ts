import { describe, expect, it } from 'vitest';
import { mockMetricsResponse } from '../../mocks/metricsMock';
import type { MetricsResponse } from './types';
import dataReducer, {
  fetchMetricsRequest,
  fetchMetricsSuccess,
  fetchMetricsFailure,
} from './dataSlice';
import { ERROR_MESSAGES } from './constants';

const initialState = {
  metrics: {} as MetricsResponse,
  isLoading: false,
  error: null,
};

describe('dataSlice tests', () => {
  it('should return initial state when undefined state and unknown action are passed', () => {
    const action = { type: 'unknown' };

    const state = dataReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('should set isLoading true and clear error when calling fetchMetricsRequest', () => {
    const previousState = {
      ...initialState,
      error: 'Erro anterior',
    };

    const state = dataReducer(previousState, fetchMetricsRequest());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should save metrics and set isLoading to false when calling fetchMetricsSuccess', () => {
    const previousState = {
      ...initialState,
      isLoading: true,
    };

    const state = dataReducer(
      previousState,
      fetchMetricsSuccess(mockMetricsResponse),
    );

    expect(state.isLoading).toBe(false);
    expect(state.metrics).toEqual(mockMetricsResponse);
    expect(state.error).toBeNull();
  });

  it('should error message and set isLoading to false when calling fetchMetricsFailure', () => {
    const previousState = {
      ...initialState,
      isLoading: true,
    };

    const state = dataReducer(
      previousState,
      fetchMetricsFailure(ERROR_MESSAGES.FETCH_METRICS),
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(ERROR_MESSAGES.FETCH_METRICS);
  });
});
