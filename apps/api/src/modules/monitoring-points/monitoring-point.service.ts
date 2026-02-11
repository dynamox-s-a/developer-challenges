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
    throw new AppError('Machine not found', 404)
  }

  if (machine.userId !== userId) {
    throw new AppError(
      'Forbidden: you can only create monitoring points for your own machines',
      403
    )
  }

  return prisma.monitoringPoint.create({
    data: {
      name: input.name,
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
  },
  userId: number
) {
  const { page, limit, sortBy, sortOrder } = query
  const skip = (page - 1) * limit

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
      where: {
        machine: { userId }
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
    }),
    prisma.monitoringPoint.count({
      where: {
        machine: { userId }
      }
    })
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
    throw new AppError('Monitoring point not found', 404)
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
    throw new AppError('Monitoring point not found', 404)
  }

  if (current.machine.userId !== userId) {
    throw new AppError(
      'Forbidden: you can only update monitoring points from your own machines',
      403
    )
  }

  return prisma.monitoringPoint.update({
    where: { id: current.id },
    data: input,
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
    throw new AppError('Monitoring point not found', 404)
  }

  if (monitoringPoint.machine.userId !== userId) {
    throw new AppError(
      'Forbidden: you can only delete monitoring points from your own machines',
      403
    )
  }

  await prisma.monitoringPoint.delete({ where: { id: monitoringPoint.id } })
}
