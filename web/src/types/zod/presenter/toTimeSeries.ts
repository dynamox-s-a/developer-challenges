import type { ITimeSeries } from '@/lib/database/timeSeries/schema'
import type { TimeSeriesDataPoint } from '../timeSeries'

export const toTimeSeriesPresenter = (
  doc: ITimeSeries,
): TimeSeriesDataPoint => ({
  _id: doc._id.toString(),
  monitoringPointId: doc.monitoringPointId.toString(),
  timestamp: doc.timestamp.toISOString(),
  value: doc.value,
  unit: doc.unit,
  createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
  updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
})

export const toTimeSeriesPresenters = (
  docs: ITimeSeries[],
): TimeSeriesDataPoint[] => docs.map(toTimeSeriesPresenter)
