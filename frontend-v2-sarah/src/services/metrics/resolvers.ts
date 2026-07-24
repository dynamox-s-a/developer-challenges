import {
  ChartTitle,
  MetricLabel,
  MetricUnit,
  YAxisTitle,
} from '../../features/data/types';
import {
  CHART_TITLE_MAP,
  LABEL_MAP,
  UNIT_MAP,
  Y_AXIS_TITLE_MAP,
} from './constants';

export const getChartTitle = (category: string): ChartTitle => {
  return CHART_TITLE_MAP[category.toLowerCase()] ?? ChartTitle.GENERAL;
};

export const getMetricLabel = (
  category: string,
  axisKey: string,
): MetricLabel => {
  const labelKey = (axisKey || category).toLowerCase();
  return LABEL_MAP[labelKey] ?? category;
};

export const getYAxisTitle = (category: string): YAxisTitle => {
  return Y_AXIS_TITLE_MAP[category.toLowerCase()] ?? YAxisTitle.NONE;
};

export const getMetricUnit = (category: string): MetricUnit => {
  return UNIT_MAP[category.toLowerCase()] ?? MetricUnit.NONE;
};
