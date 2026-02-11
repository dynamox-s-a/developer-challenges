import { Request, Response } from 'express'
import {
  monitoringPointCreateSchema,
  monitoringPointListQuerySchema,
  monitoringPointUpdateSchema,
  uuidParamSchema
} from './monitoring-point.schemas'
import {
  createMonitoringPoint,
  deleteMonitoringPoint,
  listMonitoringPoints,
  updateMonitoringPoint
} from './monitoring-point.service'
import { ResponseBase } from '../../core/base/response.base'

export async function create(req: Request, res: Response) {
  const body = monitoringPointCreateSchema.parse(req.body)
  const monitoringPoint = await createMonitoringPoint(body, req.user.id)
  return res
    .status(201)
    .json(ResponseBase.success(monitoringPoint, 'Monitoring point created'))
}

export async function list(req: Request, res: Response) {
  const query = monitoringPointListQuerySchema.parse(req.query)
  const result = await listMonitoringPoints(query, req.user.id)
  return res.json(ResponseBase.success(result, 'Monitoring points'))
}

export async function update(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  const body = monitoringPointUpdateSchema.parse(req.body)
  const monitoringPoint = await updateMonitoringPoint(uuid, body, req.user.id)
  return res.json(
    ResponseBase.success(monitoringPoint, 'Monitoring point updated')
  )
}

export async function remove(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  await deleteMonitoringPoint(uuid, req.user.id)
  return res.json(ResponseBase.success(null, 'Monitoring point deleted'))
}
