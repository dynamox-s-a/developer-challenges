import { Request, Response } from 'express'
import {
  machineCreateSchema,
  machineUpdateSchema,
  uuidParamSchema
} from './machine.schemas'
import {
  createMachine,
  deleteMachine,
  listMachines,
  updateMachine
} from './machine.service'
import { ResponseBase } from '../../core/base/response.base'

export async function create(req: Request, res: Response) {
  const body = machineCreateSchema.parse(req.body)
  const machine = await createMachine(body)
  return res.status(201).json(ResponseBase.success(machine, 'Machine created'))
}

export async function list(req: Request, res: Response) {
  const machines = await listMachines()
  return res.json(ResponseBase.success(machines, 'Machines'))
}

export async function update(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  const body = machineUpdateSchema.parse(req.body)
  const machine = await updateMachine(uuid, body)
  return res.json(ResponseBase.success(machine, 'Machine updated'))
}

export async function remove(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  await deleteMachine(uuid)
  return res.json(ResponseBase.success(null, 'Machine deleted'))
}
