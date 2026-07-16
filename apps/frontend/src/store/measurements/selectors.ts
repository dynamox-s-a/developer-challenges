import type { Metric, Series } from '@repo/contracts';
import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../root-reducer';

export type MetricGroup = {
  metric: Metric;
  label: string;
  unit: string;
  series: Series[];
};

const METRIC_ORDER: Metric[] = ['acceleration', 'velocity', 'temperature'];

export const METRIC_LABELS: Record<Metric, string> = {
  acceleration: 'Aceleração RMS',
  velocity: 'Velocidade RMS',
  temperature: 'Temperatura',
};

const selectSeries = (state: RootState) => state.measurements.series;

export const selectMetricGroups = createSelector([selectSeries], (series): MetricGroup[] =>
  METRIC_ORDER.flatMap((metric) => {
    const matching = series.filter((item) => item.metric === metric);

    if (matching.length === 0) return [];

    return [
      {
        metric,
        label: METRIC_LABELS[metric],
        unit: matching[0].unit,
        series: matching,
      },
    ];
  })
);

export const selectSelectedMachine = (state: RootState) =>
  state.machines.items.find((machine) => machine.id === state.machines.selectedId) ?? null;
