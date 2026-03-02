import { describe, expect } from 'vitest';
import timeSeriesReducer, {
  fetchTimeSeries,
  createTimeSeries,
  deleteAllTimeSeries,
} from '../../../../src/store/features/time-series/time-series.slice';
import { timeSeriesTest, initialTimeSeriesState } from '../../../fixtures/time-series.fixture';
import { errorWithoutMessage } from '../../../fixtures/utility.fixture';

describe('timeSeriesSlice', () => {
  describe('fetchTimeSeries', () => {
    describe('when pending', () => {
      timeSeriesTest('should set isLoading to true and clear the error', async ({ fake }) => {
        const action = fetchTimeSeries.pending('requestId', fake.uuid);

        const nextState = timeSeriesReducer(initialTimeSeriesState, action);

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('when fulfilled', () => {
      timeSeriesTest(
        'should store the returned entries and metrics, and stop loading',
        async ({ fake, mockEntry, mockMetrics }) => {
          const action = fetchTimeSeries.fulfilled(
            { entries: [mockEntry], metrics: mockMetrics },
            'requestId',
            fake.uuid,
          );

          const nextState = timeSeriesReducer(initialTimeSeriesState, action);

          expect(nextState.isLoading).toBe(false);
          expect(nextState.entries).toEqual([mockEntry]);
          expect(nextState.metrics).toEqual(mockMetrics);
        },
      );
    });

    describe('when rejected with a known error', () => {
      timeSeriesTest('should store the error message and stop loading', async ({ fake }) => {
        const action = fetchTimeSeries.rejected(fake.error, 'requestId', fake.uuid);

        const nextState = timeSeriesReducer(initialTimeSeriesState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe(fake.errorMessage);
      });
    });

    describe('when rejected without an error message', () => {
      timeSeriesTest(
        'should fall back to the default error message and stop loading',
        async ({ fake }) => {
          const action = fetchTimeSeries.rejected(errorWithoutMessage, 'requestId', fake.uuid);

          const nextState = timeSeriesReducer(initialTimeSeriesState, action);

          expect(nextState.isLoading).toBe(false);
          expect(nextState.error).toBe('Erro ao carregar séries temporais');
        },
      );
    });
  });

  describe('createTimeSeries', () => {
    describe('when fulfilled', () => {
      timeSeriesTest(
        'should replace entries and metrics',
        async ({ fake, mockEntry, mockMetrics }) => {
          expect(initialTimeSeriesState.entries).toEqual([]);
          expect(initialTimeSeriesState.metrics).toBeNull();

          const action = createTimeSeries.fulfilled(
            { timeSeries: [mockEntry], metrics: mockMetrics },
            'requestId',
            {
              sensorUuid: fake.uuid,
              data: [{ temperature: 0, accelerationRms: 0, velocityRms: 0 }],
            },
          );

          const nextState = timeSeriesReducer(initialTimeSeriesState, action);

          expect(nextState.entries).toEqual([mockEntry]);
          expect(nextState.metrics).toEqual(mockMetrics);
        },
      );
    });

    describe('when rejected with a known error', () => {
      timeSeriesTest('should store the error message', async ({ fake }) => {
        const action = createTimeSeries.rejected(fake.error, 'requestId', {
          sensorUuid: fake.uuid,
          data: [{ temperature: 0, accelerationRms: 0, velocityRms: 0 }],
        });

        const nextState = timeSeriesReducer(initialTimeSeriesState, action);

        expect(nextState.error).toBe(fake.errorMessage);
      });
    });

    describe('when rejected without an error message', () => {
      timeSeriesTest('should fall back to the default error message', async ({ fake }) => {
        const action = createTimeSeries.rejected(errorWithoutMessage, 'requestId', {
          sensorUuid: fake.uuid,
          data: [{ temperature: 0, accelerationRms: 0, velocityRms: 0 }],
        });

        const nextState = timeSeriesReducer(initialTimeSeriesState, action);

        expect(nextState.error).toBe('Erro ao salvar séries temporais');
      });
    });
  });

  describe('deleteAllTimeSeries', () => {
    describe('when fulfilled', () => {
      timeSeriesTest(
        'should clear entries and metrics',
        async ({ fake, initialStateWithEntries }) => {
          expect(initialStateWithEntries.entries).toHaveLength(1);
          expect(initialStateWithEntries.metrics).not.toBeNull();

          const action = deleteAllTimeSeries.fulfilled(undefined, 'requestId', fake.uuid);

          const nextState = timeSeriesReducer(initialStateWithEntries, action);

          expect(nextState.entries).toEqual([]);
          expect(nextState.metrics).toBeNull();
        },
      );
    });

    describe('when rejected with a known error', () => {
      timeSeriesTest('should store the error message', async ({ fake }) => {
        const action = deleteAllTimeSeries.rejected(fake.error, 'requestId', fake.uuid);

        const nextState = timeSeriesReducer(initialTimeSeriesState, action);

        expect(nextState.error).toBe(fake.errorMessage);
      });
    });

    describe('when rejected without an error message', () => {
      timeSeriesTest('should fall back to the default error message', async ({ fake }) => {
        const action = deleteAllTimeSeries.rejected(errorWithoutMessage, 'requestId', fake.uuid);

        const nextState = timeSeriesReducer(initialTimeSeriesState, action);

        expect(nextState.error).toBe('Erro ao remover séries temporais');
      });
    });
  });
});
