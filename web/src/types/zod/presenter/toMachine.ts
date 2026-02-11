import type { IMachine } from '@/lib/database/machine/schema'
import type { MachinePresenter, MachineType } from '../machine'

export const toMachinePresenter = (machine: IMachine): MachinePresenter => ({
  _id: machine._id.toString(),
  Name: machine.Name,
  Type: machine.Type as MachineType,
  createdAt: machine.createdAt,
  updatedAt: machine.updatedAt,
})

export const toMachinePresenters = (machines: IMachine[]): MachinePresenter[] =>
  machines.map(toMachinePresenter)
