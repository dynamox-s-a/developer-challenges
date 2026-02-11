import { Request, Response } from 'express'
import {
  sensorCreateSchema,
  sensorUpdateSchema,
  uuidParamSchema
} from './sensor.schemas'
import {
  createSensor,
  deleteSensor,
  listSensors,
  updateSensor
} from './sensor.service'
import { ResponseBase } from '../../core/base/response.base'

export async function create(req: Request, res: Response) {
  const body = sensorCreateSchema.parse(req.body)
  const sensor = await createSensor(body)
  return res.status(201).json(ResponseBase.success(sensor, 'Sensor created'))
}

export async function list(req: Request, res: Response) {
  const sensors = await listSensors()
  return res.json(ResponseBase.success(sensors, 'Sensors'))
}

export async function update(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  const body = sensorUpdateSchema.parse(req.body)
  const sensor = await updateSensor(uuid, body)
  return res.json(ResponseBase.success(sensor, 'Sensor updated'))
}

export async function remove(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  await deleteSensor(uuid)
  return res.json(ResponseBase.success(null, 'Sensor deleted'))
}
