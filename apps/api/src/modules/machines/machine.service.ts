import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

export async function createMachine(input: {
  name: string
  type: 'Pump' | 'Fan'
}) {
  const name = input.name.trim()

  const existing = await prisma.machine.findFirst({
    where: { name, type: input.type },
    select: { uuid: true }
  })

  if (existing) {
    throw new AppError(
      'A machine with the same name and type already exists',
      400
    )
  }

  return prisma.machine.create({
    data: { name, type: input.type },
    select: {
      uuid: true,
      name: true,
      type: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export async function listMachines() {
  return prisma.machine.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      uuid: true,
      name: true,
      type: true,
      createdAt: true,
      updatedAt: true
    }
  })
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
  const current = await getMachineByUuid(uuid)

  const nextName = input.name !== undefined ? input.name.trim() : current.name
  const nextType = input.type !== undefined ? input.type : current.type

  const changed = nextName !== current.name || nextType !== current.type
  if (changed) {
    const conflict = await prisma.machine.findFirst({
      where: {
        name: nextName,
        type: nextType,
        NOT: { id: current.id }
      },
      select: { uuid: true }
    })

    if (conflict) {
      throw new AppError(
        'A machine with the same name and type already exists',
        400
      )
    }
  }

  const data: { name?: string; type?: 'Pump' | 'Fan' } = {}
  if (input.name !== undefined) data.name = nextName
  if (input.type !== undefined) data.type = nextType

  return prisma.machine.update({
    where: { id: current.id },
    data,
    select: {
      uuid: true,
      name: true,
      type: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export async function deleteMachine(uuid: string) {
  const machine = await prisma.machine.findUnique({
    where: { uuid },
    select: { id: true }
  })

  if (!machine) {
    throw new AppError('Machine not found', 404)
  }

  await prisma.machine.delete({ where: { id: machine.id } })
}
