import { takeLatest } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ERROR_MESSAGES } from '../../features/data/constants';
import { getMetrics } from '../../services/metrics/metrics.service';
import { mockMetricsResponse } from '../../mocks/metricsMock';
import { dataSaga, fetchMetricsSaga } from './dataSaga';
import {
  fetchMetricsSuccess,
  fetchMetricsFailure,
  fetchMetricsRequest,
} from './dataSlice';

vi.mock('../../services/metrics/metrics.service', () => ({
  getMetrics: vi.fn(),
}));

describe('dataSaga Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const runSagaHelper = async () => {
    const dispatched: unknown[] = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({}),
      },
      fetchMetricsSaga,
    );

    return dispatched;
  };

  it('deve escutar fetchMetricsRequest e chamar fetchMetricsSaga via takeLatest', async () => {
    const generator = dataSaga();

    expect(generator.next().value).toEqual(
      takeLatest(fetchMetricsRequest.type, fetchMetricsSaga),
    );

    expect(generator.next().done).toBe(true);
  });

  it('should successfully retrieve metrics and dispatch fetchMetricsSuccess', async () => {
    vi.mocked(getMetrics).mockResolvedValueOnce(mockMetricsResponse);

    const dispatched = await runSagaHelper();

    expect(getMetrics).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([fetchMetricsSuccess(mockMetricsResponse)]);
  });

  it('should send correct error message and dispatch fetchMetricsFailure when service fails', async () => {
    vi.mocked(getMetrics).mockRejectedValueOnce(
      new Error(ERROR_MESSAGES.NETWORK_ERROR),
    );

    const dispatched = await runSagaHelper();

    expect(getMetrics).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchMetricsFailure(ERROR_MESSAGES.NETWORK_ERROR),
    ]);
  });

  it('should call getErrorMessage and dispatch fetchMetricsFailure when service fails with a string', async () => {
    vi.mocked(getMetrics).mockRejectedValueOnce('Erro');

    const dispatched = await runSagaHelper();

    expect(getMetrics).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([fetchMetricsFailure('Erro')]);
  });

  it('should call getErrorMessage and return UNEXPECTED_ERROR when error is unexpected object', async () => {
    vi.mocked(getMetrics).mockRejectedValueOnce(null);

    const dispatched = await runSagaHelper();

    expect(getMetrics).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchMetricsFailure(ERROR_MESSAGES.UNEXPECTED_ERROR),
    ]);
  });
});
