import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

export async function createMachine(input: {
  name: string
  type: 'Pump' | 'Fan'
}) {
  return prisma.machine.create({ data: input })
}

export async function listMachines() {
  return prisma.machine.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getMachineByUuid(uuid: string) {
  const machine = await prisma.machine.findUnique({ where: { uuid } })
  if (!machine) throw new AppError('Machine not found', 404)
  return machine
}

export async function updateMachine(
  uuid: string,
  input: { name?: string; type?: 'Pump' | 'Fan' }
) {
  await getMachineByUuid(uuid)
  return prisma.machine.update({ where: { uuid }, data: input })
}

export async function deleteMachine(uuid: string) {
  await getMachineByUuid(uuid)
  await prisma.machine.delete({ where: { uuid } })
}
