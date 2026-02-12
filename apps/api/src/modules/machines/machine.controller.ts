import { Request, Response } from 'express'
import {
  machineCreateSchema,
  machineUpdateSchema,
  uuidParamSchema
} from './machine.schemas'
import {
  createMachine,
  deleteMachine,
  getMachineByUuid,
  listMachines,
  updateMachine
} from './machine.service'
import { ResponseBase } from '../../core/base/response.base'

export async function create(req: Request, res: Response) {
  const body = machineCreateSchema.parse(req.body)
  const machine = await createMachine(body, req.user.id)
  return res.status(201).json(ResponseBase.success(machine, 'Máquina criada'))
}

export async function list(req: Request, res: Response) {
  const machines = await listMachines(req.user.id)
  return res.json(ResponseBase.success(machines, 'Todas as máquinas'))
}

export async function getById(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  const machine = await getMachineByUuid(uuid, req.user.id)
  return res.json(ResponseBase.success(machine, 'Máquina'))
}

export async function update(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  const body = machineUpdateSchema.parse(req.body)
  const machine = await updateMachine(uuid, body, req.user.id)
  return res.json(ResponseBase.success(machine, 'Máquina atualizada'))
}

export async function remove(req: Request, res: Response) {
  const { uuid } = uuidParamSchema.parse(req.params)
  await deleteMachine(uuid, req.user.id)
  return res.json(ResponseBase.success(null, 'Máquina deletada'))
}
