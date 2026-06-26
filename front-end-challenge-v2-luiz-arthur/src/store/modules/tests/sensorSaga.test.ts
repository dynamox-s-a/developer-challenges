import { describe, it } from 'vitest';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { fetchDataSaga } from '../sensorSaga';
import { fetchAllMetrics } from '../../../services/api';
import { fetchDataSuccess, fetchDataFailure } from '../sensorSlice';

describe('sensorSaga', () => {
  it('should call API and dispatch success', () => {
    const mockData = [{ name: 'accelerationRms/x', data: [] }];
    return expectSaga(fetchDataSaga)
      .provide([
        [matchers.call.fn(fetchAllMetrics), mockData],
      ])
      .put(fetchDataSuccess(mockData))
      .run();
  });

  it('should handle API error', () => {
    const error = new Error('Network error');
    return expectSaga(fetchDataSaga)
      .provide([
        [matchers.call.fn(fetchAllMetrics), Promise.reject(error)],
      ])
      .put(fetchDataFailure(error.message))
      .run();
  });
});