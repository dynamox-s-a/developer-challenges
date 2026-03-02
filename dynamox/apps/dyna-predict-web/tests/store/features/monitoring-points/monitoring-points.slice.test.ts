import { describe, expect } from 'vitest';
import monitoringPointsReducer, {
  fetchMonitoringPoints,
} from '../../../../src/store/features/monitoring-points/monitoring-points.slice';
import {
  monitoringPointTest,
  initialMonitoringPointsState,
} from '../../../fixtures/monitoring-point.fixture';
import { errorWithoutMessage } from '../../../fixtures/utility.fixture';

describe('monitoringPointsSlice', () => {
  describe('fetchMonitoringPoints', () => {
    describe('when pending', () => {
      monitoringPointTest('should set isLoading to true and clear the error', async () => {
        const action = fetchMonitoringPoints.pending('requestId', {});

        const nextState = monitoringPointsReducer(initialMonitoringPointsState, action);

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('when fulfilled', () => {
      monitoringPointTest('should store the returned monitoring points and pagination, and stop loading', async ({ mockMonitoringPoint, mockPagination }) => {
        const action = fetchMonitoringPoints.fulfilled(
          { monitoringPoints: [mockMonitoringPoint], pagination: mockPagination },
          'requestId',
          {},
        );

        const nextState = monitoringPointsReducer(initialMonitoringPointsState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.monitoringPoints).toEqual([mockMonitoringPoint]);
        expect(nextState.pagination).toEqual(mockPagination);
      });
    });

    describe('when rejected with a known error', () => {
      monitoringPointTest('should store the error message and stop loading', async ({ fake }) => {
        const action = fetchMonitoringPoints.rejected(fake.error, 'requestId', {});

        const nextState = monitoringPointsReducer(initialMonitoringPointsState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe(fake.errorMessage);
      });
    });

    describe('when rejected without an error message', () => {
      monitoringPointTest('should fall back to the default error message and stop loading', async () => {
        const action = fetchMonitoringPoints.rejected(errorWithoutMessage, 'requestId', {});

        const nextState = monitoringPointsReducer(initialMonitoringPointsState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Erro ao carregar pontos de monitoramento');
      });
    });
  });
});
