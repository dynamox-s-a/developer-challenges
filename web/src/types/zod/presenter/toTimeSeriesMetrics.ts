/** biome-ignore-all lint/suspicious/noExplicitAny: idk */
import type { TimeSeriesMetrics } from '../timeSeries'

export const toTimeSeriesMetricsPresenter = (
  metrics: any,
): TimeSeriesMetrics => ({
  monitoringPointId: metrics.monitoringPointId,
  count: metrics.count,
  avg: metrics.avg,
  min: metrics.min,
  max: metrics.max,
  firstTimestamp: metrics.firstTimestamp?.toISOString() ?? null,
  lastTimestamp: metrics.lastTimestamp?.toISOString() ?? null,
})
