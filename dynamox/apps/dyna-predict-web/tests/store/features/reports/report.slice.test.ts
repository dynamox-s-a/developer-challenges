import { describe, expect } from 'vitest';
import reportsReducer, {
  fetchDashboardMetrics,
} from '../../../../src/store/features/reports/report.slice';
import { reportTest, initialReportsState } from '../../../fixtures/report.fixture';

describe('reportsSlice', () => {
  describe('fetchDashboardMetrics', () => {
    describe('when pending', () => {
      reportTest('should set isLoading to true and clear the error', async () => {
        const action = fetchDashboardMetrics.pending('requestId', undefined);

        const nextState = reportsReducer(initialReportsState, action);

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('when fulfilled', () => {
      reportTest('should store the returned metrics and stop loading', async ({ mockMetrics }) => {
        const action = fetchDashboardMetrics.fulfilled(mockMetrics, 'requestId', undefined);

        const nextState = reportsReducer(initialReportsState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.metrics).toEqual(mockMetrics);
      });
    });

    describe('when rejected', () => {
      reportTest('should set the hardcoded error message and stop loading', async () => {
        const action = fetchDashboardMetrics.rejected(null, 'requestId', undefined);

        const nextState = reportsReducer(initialReportsState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Erro inesperado ao carregar métricas. Por favor, tente novamente mais tarde.');
      });
    });
  });
});
