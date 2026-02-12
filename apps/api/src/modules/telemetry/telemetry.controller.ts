import { Request, Response } from 'express'

import {
  timeSeriesCreateSchema,
  timeSeriesDeleteQuerySchema,
  timeSeriesListQuerySchema,
  timeSeriesMetricsQuerySchema,
  uuidParamSchema
} from './telemetry.schemas'
import {
  createSensorTimeSeries,
  listSensorTimeSeries,
  countSensorTimeSeries,
  getSensorTimeSeriesMetrics,
  deleteSensorTimeSeries,
  deleteTelemetryBatch
} from './telemetry.service'
import { ResponseBase } from '../../core/base/response.base'

export async function create(req: Request, res: Response) {
  const { uuid: sensorUuid } = uuidParamSchema.parse(req.params)
  const body = timeSeriesCreateSchema.parse(req.body)

  const userId = req.user?.id

  const result = await createSensorTimeSeries({
    userId,
    sensorUuid,
    intervalMinutes: body.intervalMinutes,
    points: body.points
  })

  return res
    .status(201)
    .json(ResponseBase.success(result, 'Série temporal armazenada'))
}

export async function list(req: Request, res: Response) {
  const { uuid: sensorUuid } = uuidParamSchema.parse(req.params)
  const query = timeSeriesListQuerySchema.parse(req.query)
  const userId = req.user?.id

  const result = await listSensorTimeSeries({ userId, sensorUuid, ...query })
  return res.status(200).json(ResponseBase.success(result))
}

export async function count(req: Request, res: Response) {
  const { uuid: sensorUuid } = uuidParamSchema.parse(req.params)
  const userId = req.user?.id

  const result = await countSensorTimeSeries({ userId, sensorUuid })
  return res.status(200).json(ResponseBase.success(result))
}

export async function metrics(req: Request, res: Response) {
  const { uuid: sensorUuid } = uuidParamSchema.parse(req.params)
  const query = timeSeriesMetricsQuerySchema.parse(req.query)
  const userId = req.user?.id

  const result = await getSensorTimeSeriesMetrics({
    userId,
    sensorUuid,
    ...query
  })
  return res.status(200).json(ResponseBase.success(result))
}

export async function remove(req: Request, res: Response) {
  const { uuid: sensorUuid } = uuidParamSchema.parse(req.params)
  const query = timeSeriesDeleteQuerySchema.parse(req.query)
  const userId = req.user?.id

  const result = await deleteSensorTimeSeries({ userId, sensorUuid, ...query })
  return res
    .status(200)
    .json(ResponseBase.success(result, 'Série temporal deletada'))
}

export async function removeBatch(req: Request, res: Response) {
  const { uuid: batchUuid } = uuidParamSchema.parse(req.params)
  const userId = req.user?.id

  const result = await deleteTelemetryBatch({ userId, batchUuid })
  return res.status(200).json(ResponseBase.success(result, 'Lote deletado'))
}
