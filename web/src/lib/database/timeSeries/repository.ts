import {
  toTimeSeriesPresenter,
  toTimeSeriesPresenters,
} from '@/types/zod/presenter/toTimeSeries'
import TimeSeries, { type ITimeSeries } from './schema'
import type {
  CreateTimeSeriesBatchDto,
  CreateTimeSeriesPointDto,
  TimeSeriesDataPoint,
  TimeSeriesMetrics,
} from '@/types/zod/timeSeries'

import { Types } from 'mongoose'
import { toTimeSeriesMetricsPresenter } from '@/types/zod/presenter/toTimeSeriesMetrics'

export class TimeSeriesRepository {
  async create(
    dto: CreateTimeSeriesPointDto | CreateTimeSeriesBatchDto,
  ): Promise<TimeSeriesDataPoint | TimeSeriesDataPoint[]> {
    const isArray = Array.isArray(dto)
    const data = isArray ? dto : [dto]

    const docs = data.map(item => ({
      monitoringPointId: new Types.ObjectId(item.monitoringPointId),
      timestamp: item.timestamp,
      value: item.value,
      unit: item.unit,
    }))

    const inserted = await TimeSeries.insertMany(docs)
    const result = inserted.map(doc =>
      toTimeSeriesPresenter(doc.toObject() as ITimeSeries),
    )

    return isArray ? result : result[0]
  }

  async getByMonitoringPoint(
    monitoringPointId: string,
    page: number = 0,
    pageSize: number = 50,
  ): Promise<{
    data: TimeSeriesDataPoint[]
    total: number
    page: number
    pageSize: number
  }> {
    const filter = { monitoringPointId: new Types.ObjectId(monitoringPointId) }
    const skip = page * pageSize

    const [data, total] = await Promise.all([
      TimeSeries.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean<ITimeSeries[]>(),
      TimeSeries.countDocuments(filter),
    ])

    return {
      data: toTimeSeriesPresenters(data),
      total,
      page,
      pageSize,
    }
  }

  async getMetrics(monitoringPointId: string): Promise<TimeSeriesMetrics> {
    const [result] = await TimeSeries.aggregate([
      { $match: { monitoringPointId: new Types.ObjectId(monitoringPointId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avg: { $avg: '$value' },
          min: { $min: '$value' },
          max: { $max: '$value' },
          firstTimestamp: { $min: '$timestamp' },
          lastTimestamp: { $max: '$timestamp' },
        },
      },
    ])

    if (!result) {
      return {
        monitoringPointId,
        count: 0,
        avg: null,
        min: null,
        max: null,
        firstTimestamp: null,
        lastTimestamp: null,
      }
    }

    return toTimeSeriesMetricsPresenter({
      monitoringPointId,
      ...result,
    })
  }

  async getCount(monitoringPointId: string): Promise<number> {
    return TimeSeries.countDocuments({
      monitoringPointId: new Types.ObjectId(monitoringPointId),
    })
  }

  async delete(dataPointId: string): Promise<boolean> {
    const result = await TimeSeries.deleteOne({
      _id: new Types.ObjectId(dataPointId),
    })
    return result.deletedCount === 1
  }

  async deleteAllByMonitoringPoint(
    monitoringPointId: string,
  ): Promise<boolean> {
    const result = await TimeSeries.deleteMany({
      monitoringPointId: new Types.ObjectId(monitoringPointId),
    })
    return result.acknowledged
  }
}

const timeSeriesRepository = new TimeSeriesRepository()
export default timeSeriesRepository
