import { fetchTelemetry } from '../slice';
import telemetryReducer from '../slice';
import type { RawSeries } from '../types';

const initialState = {
    series: [],
    isLoading: false,
    error: null,
};

const mockSeries: RawSeries[] = [
    { name: 'accelerationRms/x', data: [] },
    { name: 'temperature', data: [] },
];

describe('telemetrySlice', () => {
    it('should return the initial state', () => {
        expect(telemetryReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should set isLoading to true on pending', () => {
        const action = fetchTelemetry.pending('', undefined);
        const state = telemetryReducer(initialState, action);

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should populate series and set isLoading to false on fulfilled', () => {
        const action = fetchTelemetry.fulfilled(mockSeries, '', undefined);
        const state = telemetryReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.series).toEqual(mockSeries);
    });

    it('should record the error and set isLoading to false on rejected', () => {
        const action = fetchTelemetry.rejected(new Error('Falha na requisição'), '', undefined);
        const state = telemetryReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Falha na requisição');
    });
});
