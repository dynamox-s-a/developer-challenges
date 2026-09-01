import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import { buildDashboardView } from './dashboardAggregations';
import type { DashboardState } from './dashboardSlice';

export const selectDashboard = (state: RootState): DashboardState => state.dashboard;

export const selectDashboardInventoryLoading = createSelector(
  [selectDashboard],
  (dashboard) =>
    [dashboard.machines, dashboard.points, dashboard.series].some(
      (resource) => resource.status === 'idle' || resource.status === 'loading',
    ),
);

export const selectDashboardPartialErrors = createSelector([selectDashboard], (dashboard) =>
  [
    dashboard.machines.error ? `Máquinas: ${dashboard.machines.error}` : null,
    dashboard.points.error ? `Pontos: ${dashboard.points.error}` : null,
    dashboard.series.error ? `Séries: ${dashboard.series.error}` : null,
    Object.keys(dashboard.radialSampleErrors).length > 0
      ? `${Object.keys(dashboard.radialSampleErrors).length} série(s) sem avaliação de condição.`
      : null,
  ].flatMap((value) => (value ? [value] : [])),
);

/**
 * O cálculo percorre inventário, métricas e amostras radiais. Um selector por instância
 * evita refazê-lo quando o componente renderiza sem mudança nessas referências.
 */
export const createSelectDashboardView = (nowMs: number) =>
  createSelector([selectDashboard], (dashboard) => buildDashboardView(dashboard, nowMs));
