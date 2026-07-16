import { describe, expect, it } from 'vitest';

import { seriesFixture } from 'src/test/fixtures';

import {
  fetchMeasurements,
  fetchMeasurementsFailed,
  fetchMeasurementsSucceeded,
  measurementsSlice,
  periodChanged,
} from './slice';

const reducer = measurementsSlice.reducer;
const initial = measurementsSlice.getInitialState();

describe('measurementsSlice', () => {
  it('começa exibindo a série completa', () => {
    expect(initial.period).toBe('all');
  });

  it('entra em loading ao buscar', () => {
    const state = reducer(initial, fetchMeasurements({ machineId: 'MCH-001' }));

    expect(state).toMatchObject({ status: 'loading', error: null });
  });

  it('guarda as séries recebidas', () => {
    const state = reducer(initial, fetchMeasurementsSucceeded(seriesFixture));

    expect(state.series).toHaveLength(4);
    expect(state.status).toBe('succeeded');
  });

  it('descarta as séries antigas ao falhar, para não exibir dado de outro recorte', () => {
    const loaded = reducer(initial, fetchMeasurementsSucceeded(seriesFixture));
    const state = reducer(loaded, fetchMeasurementsFailed('timeout'));

    expect(state.series).toEqual([]);
    expect(state).toMatchObject({ status: 'failed', error: 'timeout' });
  });

  it('troca o período sem mexer nas séries já carregadas', () => {
    const loaded = reducer(initial, fetchMeasurementsSucceeded(seriesFixture));
    const state = reducer(loaded, periodChanged('7d'));

    expect(state.period).toBe('7d');
    expect(state.series).toHaveLength(4);
  });
});
