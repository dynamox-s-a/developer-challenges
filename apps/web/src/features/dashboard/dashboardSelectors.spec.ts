import { describe, expect, it } from 'vitest';

import { createStore } from '../../store';
import {
  createSelectDashboardView,
  selectDashboardInventoryLoading,
  selectDashboardPartialErrors,
} from './dashboardSelectors';
import { initialDashboardState } from './dashboardSlice';

describe('dashboardSelectors', () => {
  it('deriva loading e erros parciais sem expor a estrutura do store ao componente', () => {
    const store = createStore({
      dashboard: {
        ...initialDashboardState,
        machines: { status: 'succeeded', data: [], error: null },
        points: { status: 'failed', data: [], error: 'Pontos indisponíveis' },
        series: { status: 'succeeded', data: [], error: null },
      },
    });

    expect(selectDashboardInventoryLoading(store.getState())).toBe(false);
    expect(selectDashboardPartialErrors(store.getState())).toEqual([
      'Pontos: Pontos indisponíveis',
    ]);
  });

  it('memoiza a visão operacional enquanto o estado de entrada não muda', () => {
    const store = createStore();
    const selectView = createSelectDashboardView(Date.parse('2026-08-30T12:00:00Z'));

    expect(selectView(store.getState())).toBe(selectView(store.getState()));
  });
});
