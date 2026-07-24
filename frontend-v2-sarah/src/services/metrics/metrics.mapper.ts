import type { RawMetricsResponse } from './type';
import {
  ChartTitle,
  MetricLabel,
  YAxisTitle,
  MetricUnit,
  type MetricsResponse,
  type MetricSeries,
  type ChartPoint,
} from '../../features/data/types';

const CHART_TITLE_MAP: Record<string, ChartTitle> = {
  accelerationrms: ChartTitle.ACCELERATION,
  velocityrms: ChartTitle.VELOCITY,
  temperature: ChartTitle.TEMPERATURE,
};

const LABEL_MAP: Record<string, MetricLabel> = {
  x: MetricLabel.AXIAL,
  y: MetricLabel.HORIZONTAL,
  z: MetricLabel.RADIAL,
  temperature: MetricLabel.TEMPERATURE,
};

const Y_AXIS_TITLE_MAP: Record<string, YAxisTitle> = {
  accelerationrms: YAxisTitle.ACCELERATION,
  velocityrms: YAxisTitle.VELOCITY,
  temperature: YAxisTitle.TEMPERATURE,
};

const UNIT_MAP: Record<string, MetricUnit> = {
  accelerationrms: MetricUnit.G,
  velocityrms: MetricUnit.MM_S,
  temperature: MetricUnit.CELSIUS,
};

const getChartTitle = (category: string): ChartTitle => {
  return CHART_TITLE_MAP[category.toLowerCase()] ?? ChartTitle.GENERAL;
};

const getMetricLabel = (category: string, axisKey: string): MetricLabel => {
  const labelKey = (axisKey || category).toLowerCase();
  return LABEL_MAP[labelKey] ?? category;
};

const getYAxisTitle = (category: string): YAxisTitle => {
  return Y_AXIS_TITLE_MAP[category.toLowerCase()] ?? YAxisTitle.NONE;
};

const getMetricUnit = (category: string): MetricUnit => {
  return UNIT_MAP[category.toLowerCase()] ?? MetricUnit.NONE;
};

export const mapRawMetricsToMetricsResponse = (
  rawMetrics: RawMetricsResponse,
): MetricsResponse => {
  if (!Array.isArray(rawMetrics)) return {};

  return rawMetrics.reduce<MetricsResponse>((chart, metric, index) => {
    const { name, data } = metric;
    const [category, axisKey] = name.split('/');

    const chartTitle = getChartTitle(category);
    const label = getMetricLabel(category, axisKey);
    const yAxisTitle = getYAxisTitle(category);
    const unit = getMetricUnit(category);

    if (!chart[category]) {
      chart[category] = {
        category,
        chartTitle,
        yAxisTitle,
        unit,
        series: [],
      };
    }

    const series: MetricSeries = {
      id: `${name.replace(/[^a-zA-Z0-9]/g, '-')}-series-${index}`,
      name,
      category,
      label,
      yAxisTitle,
      unit,
      data: data.map(
        (point) =>
          [new Date(point.datetime).getTime(), point.max] as ChartPoint,
      ),
    };

    chart[category].series.push(series);

    return chart;
  }, {});
};
