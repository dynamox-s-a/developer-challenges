import type { RawMetricsResponse } from './type';
import {
  type MetricsResponse,
  type MetricSeries,
  type ChartPoint,
} from '../../features/data/types';
import {
  getChartTitle,
  getMetricLabel,
  getMetricUnit,
  getYAxisTitle,
} from './resolvers';
import { timestampMsFormatter } from '../../utils/date';

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
      label,
      data: data.map(
        (point) =>
          [timestampMsFormatter(point.datetime), point.max] as ChartPoint,
      ),
    };

    chart[category].series.push(series);

    return chart;
  }, {});
};
