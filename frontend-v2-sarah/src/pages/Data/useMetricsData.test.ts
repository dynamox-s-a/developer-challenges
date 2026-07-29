import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMetricsData } from './useMetricsData';
import * as reduxHooks from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';
import type { MetricsResponse } from '../../features/data/types';

vi.mock('../../app/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../features/data/dataSlice', () => ({
  fetchMetricsRequest: vi.fn(() => ({ type: 'data/fetchMetricsRequest' })),
}));

describe('useMetricsData Hook Test', () => {
  const mockDispatch = vi.fn();
  const initialState = {
    metrics: {} as MetricsResponse,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // configurando um mockado para o dispatch que retorna o mockDispatch
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  it('should return initial state data correctly', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue(initialState);

    const { result } = renderHook(() => useMetricsData());

    expect(result.current.metrics).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call fetchMetricsRequest if it hasnt already been called and isnt loading', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue(initialState);

    renderHook(() => useMetricsData());

    // através do hasFetched verifica se a action foi despachada somente uma vez
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(fetchMetricsRequest).toHaveBeenCalled();
  });

  it('should call fetchMetricsRequest if isLoading is true or if fetchMetricsRequest has already been called once', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
      ...initialState,
      isLoading: true,
    });

    renderHook(() => useMetricsData());

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(fetchMetricsRequest).not.toHaveBeenCalled();
  });
});
