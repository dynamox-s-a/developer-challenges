import { describe, expect, it } from 'vitest';

import { machineFixture, seriesFixture } from 'src/test/fixtures';

import type { RootState } from '../root-reducer';
import { selectMetricGroups, selectSelectedMachine } from './selectors';

const makeState = (overrides: Partial<RootState> = {}): RootState =>
  ({
    machines: { items: [machineFixture], selectedId: 'MCH-001', status: 'succeeded', error: null },
    measurements: { series: seriesFixture, period: 'all', status: 'succeeded', error: null },
    ...overrides,
  }) as RootState;

describe('selectMetricGroups', () => {
  it('agrupa as séries por grandeza, um grupo por gráfico', () => {
    const groups = selectMetricGroups(makeState());

    expect(groups.map((group) => group.metric)).toEqual(['acceleration', 'velocity', 'temperature']);
    expect(groups[0].series).toHaveLength(2);
    expect(groups[2].series).toHaveLength(1);
  });

  it('usa a unidade das séries do grupo', () => {
    const groups = selectMetricGroups(makeState());

    expect(groups.map((group) => group.unit)).toEqual(['g', 'mm/s', '°C']);
  });

  it('omite grandezas sem série em vez de criar gráfico vazio', () => {
    const state = makeState({
      measurements: {
        series: seriesFixture.filter((series) => series.metric === 'temperature'),
        period: 'all',
        status: 'succeeded',
        error: null,
      },
    });

    expect(selectMetricGroups(state).map((group) => group.metric)).toEqual(['temperature']);
  });

  it('devolve lista vazia sem séries', () => {
    const state = makeState({
      measurements: { series: [], period: 'all', status: 'succeeded', error: null },
    });

    expect(selectMetricGroups(state)).toEqual([]);
  });
});

describe('selectSelectedMachine', () => {
  it('resolve a máquina selecionada', () => {
    expect(selectSelectedMachine(makeState())?.name).toBe('Ventilador de Exaustão 01');
  });

  it('devolve null quando o id selecionado não existe na lista', () => {
    const state = makeState({
      machines: { items: [machineFixture], selectedId: 'MCH-999', status: 'succeeded', error: null },
    });

    expect(selectSelectedMachine(state)).toBeNull();
  });
});
