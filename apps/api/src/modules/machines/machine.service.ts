import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

export async function createMachine(
  input: { name: string; type: 'Pump' | 'Fan' },
  userId: number
) {
  const name = input.name.trim()

  const existing = await prisma.machine.findFirst({
    where: { userId, name, type: input.type },
    select: { uuid: true }
  })

  if (existing) {
    throw new AppError('Uma máquina com o mesmo nome e tipo já existe', 400)
  }

  return prisma.machine.create({
    data: { name, type: input.type, userId },
    select: {
      uuid: true,
      name: true,
      type: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export async function listMachines(userId: number) {
  return prisma.machine.findMany({
    where: { userId },
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

export async function getMachineByUuid(uuid: string, userId: number) {
  const machine = await prisma.machine.findFirst({
    where: { uuid, userId },
    select: {
      uuid: true,
      name: true,
      type: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!machine) {
    throw new AppError('Máquina não encontrada', 404)
  }

  return machine
}

export async function updateMachine(
  uuid: string,
  input: { name?: string; type?: 'Pump' | 'Fan' },
  userId: number
) {
  const current = await prisma.machine.findUnique({
    where: { uuid },
    select: { id: true, name: true, type: true, userId: true }
  })

  if (!current) {
    throw new AppError('Máquina não encontrada', 404)
  }

  if (current.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode atualizar suas próprias máquinas',
      403
    )
  }

  const nextName = input.name !== undefined ? input.name.trim() : current.name
  const nextType = input.type !== undefined ? input.type : current.type

  const changed = nextName !== current.name || nextType !== current.type
  if (changed) {
    const conflict = await prisma.machine.findFirst({
      where: {
        userId,
        name: nextName,
        type: nextType,
        NOT: { id: current.id }
      },
      select: { uuid: true }
    })

    if (conflict) {
      throw new AppError('Uma máquina com o mesmo nome e tipo já existe', 400)
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

export async function deleteMachine(uuid: string, userId: number) {
  const machine = await prisma.machine.findUnique({
    where: { uuid },
    select: { id: true, userId: true }
  })

  if (!machine) {
    throw new AppError('Máquina não encontrada', 404)
  }

  if (machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode deletar suas próprias máquinas',
      403
    )
  }

  await prisma.machine.delete({ where: { id: machine.id } })
}
