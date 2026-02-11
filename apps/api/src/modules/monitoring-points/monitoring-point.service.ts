import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

export async function createMonitoringPoint(input: {
  name: string
  machineUuid: string
}) {
  const machine = await prisma.machine.findUnique({
    where: { uuid: input.machineUuid }
  })

  if (!machine) {
    throw new AppError('Machine not found', 404)
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
      // sensor: {
      //   select: {
      //     uuid: true,
      //     sensorUniqueId : true,
      //     model: true
      //   }
      // }
    }
  })
}

export async function listMonitoringPoints(query: {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}) {
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
    prisma.monitoringPoint.count()
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
  input: { name?: string }
) {
  const current = await prisma.monitoringPoint.findUnique({
    where: { uuid },
    select: { id: true }
  })

  if (!current) {
    throw new AppError('Monitoring point not found', 404)
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

export async function deleteMonitoringPoint(uuid: string) {
  const monitoringPoint = await prisma.monitoringPoint.findUnique({
    where: { uuid },
    select: { id: true }
  })

  if (!monitoringPoint) {
    throw new AppError('Monitoring point not found', 404)
  }

  await prisma.monitoringPoint.delete({ where: { id: monitoringPoint.id } })
}
