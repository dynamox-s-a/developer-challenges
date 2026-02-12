import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

export async function createMonitoringPoint(
  input: { name: string; machineUuid: string },
  userId: number
) {
  const machine = await prisma.machine.findUnique({
    where: { uuid: input.machineUuid },
    select: { id: true, userId: true }
  })

  if (!machine) {
    throw new AppError('Máquina não encontrada', 404)
  }

  if (machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode criar pontos de monitoramento para suas próprias máquinas',
      403
    )
  }

  return prisma.monitoringPoint.create({
    data: {
      name: input.name.trim(),
      machineId: machine.id
    },
    select: {
      uuid: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      machine: {
        select: {
          uuid: true,
          name: true,
          type: true
        }
      },
      sensor: {
        select: {
          uuid: true,
          sensorUniqueId: true,
          model: true
        }
      }
    }
  })
}

export async function listMonitoringPoints(
  query: {
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
    machineUuid?: string
  },
  userId: number
) {
  const { page, limit, sortBy, sortOrder, machineUuid } = query
  const skip = (page - 1) * limit

  const where = {
    machine: {
      userId,
      ...(machineUuid ? { uuid: machineUuid } : {})
    }
  }

  let orderBy: any = {}

  switch (sortBy) {
    case 'machineName':
      orderBy = { machine: { name: sortOrder } }
      break
    case 'machineType':
      orderBy = { machine: { type: sortOrder } }
      break
    case 'name':
      orderBy = { name: sortOrder }
      break
    case 'sensorModel':
      orderBy = { sensor: { model: sortOrder } }
      break
    case 'createdAt':
    default:
      orderBy = { createdAt: sortOrder }
      break
  }

  const [data, total] = await Promise.all([
    prisma.monitoringPoint.findMany({
      skip,
      take: limit,
      orderBy,
      where,
      select: {
        uuid: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        machine: {
          select: {
            uuid: true,
            name: true,
            type: true
          }
        },
        sensor: {
          select: {
            uuid: true,
            sensorUniqueId: true,
            model: true
          }
        }
      }
    }),
    prisma.monitoringPoint.count({ where })
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function getMonitoringPointByUuid(uuid: string) {
  const monitoringPoint = await prisma.monitoringPoint.findUnique({
    where: { uuid },
    select: {
      uuid: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      machine: {
        select: {
          uuid: true,
          name: true,
          type: true
        }
      },
      sensor: {
        select: {
          uuid: true,
          sensorUniqueId: true,
          model: true
        }
      }
    }
  })

  if (!monitoringPoint) {
    throw new AppError('Ponto de monitoramento não encontrado', 404)
  }

  return monitoringPoint
}

export async function updateMonitoringPoint(
  uuid: string,
  input: { name?: string },
  userId: number
) {
  const current = await prisma.monitoringPoint.findUnique({
    where: { uuid },
    select: {
      id: true,
      machine: {
        select: { userId: true }
      }
    }
  })

  if (!current) {
    throw new AppError('Ponto de monitoramento não encontrado', 404)
  }

  if (current.machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode atualizar pontos de monitoramento de suas próprias máquinas',
      403
    )
  }

  const data: { name?: string } = {}
  if (input.name !== undefined) data.name = input.name.trim()

  return prisma.monitoringPoint.update({
    where: { id: current.id },
    data,
    select: {
      uuid: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      machine: {
        select: {
          uuid: true,
          name: true,
          type: true
        }
      },
      sensor: {
        select: {
          uuid: true,
          sensorUniqueId: true,
          model: true
        }
      }
    }
  })
}

export async function deleteMonitoringPoint(uuid: string, userId: number) {
  const monitoringPoint = await prisma.monitoringPoint.findUnique({
    where: { uuid },
    select: {
      id: true,
      machine: {
        select: { userId: true }
      }
    }
  })

  if (!monitoringPoint) {
    throw new AppError('Ponto de monitoramento não encontrado', 404)
  }

  if (monitoringPoint.machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode deletar pontos de monitoramento de suas próprias máquinas',
      403
    )
  }

  await prisma.monitoringPoint.delete({ where: { id: monitoringPoint.id } })
}
