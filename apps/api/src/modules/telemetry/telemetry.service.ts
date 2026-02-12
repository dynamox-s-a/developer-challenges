import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

function computeAccelerationRms(x: number, y: number, z: number) {
  return Math.sqrt(x * x + y * y + z * z)
}

async function getSensorOrThrow(sensorUuid: string) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid: sensorUuid },
    select: {
      id: true,
      monitoringPoint: {
        select: {
          machine: {
            select: { userId: true, type: true }
          }
        }
      }
    }
  })

  if (!sensor) throw new AppError('Sensor não encontrado', 404)
  return sensor
}

function assertOwnership(
  userId: number | undefined,
  machineUserId: number | undefined
) {
  if (userId && machineUserId && userId !== machineUserId) {
    throw new AppError('Proibido', 403)
  }
}

export async function createSensorTimeSeries(input: {
  userId?: number
  sensorUuid: string
  intervalMinutes?: number
  points: Array<{
    timestamp: Date
    x: number
    y: number
    z: number
    temperature: number
  }>
}) {
  const sensor = await getSensorOrThrow(input.sensorUuid)
  assertOwnership(input.userId, sensor.monitoringPoint.machine.userId)

  const map = new Map<
    number,
    { timestamp: Date; x: number; y: number; z: number; temperature: number }
  >()
  for (const p of input.points) map.set(p.timestamp.getTime(), p)
  const uniquePoints = Array.from(map.values())
  const duplicatesInPayload = input.points.length - uniquePoints.length

  const times = uniquePoints
    .map((p) => p.timestamp.getTime())
    .sort((a, b) => a - b)
  const fromTimestamp = new Date(times[0])
  const toTimestamp = new Date(times[times.length - 1])

  const result = await prisma.$transaction(async (tx) => {
    const batch = await tx.telemetryBatch.create({
      data: {
        sensorId: sensor.id,
        intervalMinutes: input.intervalMinutes,
        pointsCount: 0,
        fromTimestamp,
        toTimestamp
      },
      select: { uuid: true, id: true }
    })

    const rows = uniquePoints.map((p) => ({
      sensorId: sensor.id,
      batchId: batch.id,
      timestamp: p.timestamp,
      x: p.x,
      y: p.y,
      z: p.z,
      temperature: p.temperature,
      accelerationRms: computeAccelerationRms(p.x, p.y, p.z)
    }))

    const created = await tx.telemetryPoint.createMany({
      data: rows,
      skipDuplicates: true
    })

    await tx.telemetryBatch.update({
      where: { id: batch.id },
      data: { pointsCount: created.count }
    })

    return {
      batchUuid: batch.uuid,
      receivedPoints: input.points.length,
      uniquePoints: uniquePoints.length,
      insertedPoints: created.count,
      duplicatesInPayload,
      duplicatesSkippedByDb: uniquePoints.length - created.count,
      fromTimestamp,
      toTimestamp
    }
  })

  return result
}

export async function listSensorTimeSeries(input: {
  userId?: number
  sensorUuid: string
  from?: Date
  to?: Date
  limit?: number
  order?: 'asc' | 'desc'
}) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid: input.sensorUuid },
    select: {
      id: true,
      uuid: true,
      sensorUniqueId: true,
      model: true,
      monitoringPoint: {
        select: {
          machine: { select: { userId: true } }
        }
      }
    }
  })

  if (!sensor) throw new AppError('Sensor não encontrado', 404)

  if (input.userId && sensor.monitoringPoint.machine.userId !== input.userId) {
    throw new AppError('Proibido', 403)
  }

  const order: 'asc' | 'desc' = input.order ?? 'asc'
  const limit = input.limit ?? 1000

  const timestampFilter: { gte?: Date; lte?: Date } = {}
  if (input.from) timestampFilter.gte = input.from
  if (input.to) timestampFilter.lte = input.to

  const where: any = { sensorId: sensor.id }
  if (input.from || input.to) where.timestamp = timestampFilter

  const points = await prisma.telemetryPoint.findMany({
    where,
    orderBy: { timestamp: order },
    take: limit,
    select: {
      timestamp: true,
      x: true,
      y: true,
      z: true,
      temperature: true,
      accelerationRms: true
    }
  })

  return {
    sensor: {
      uuid: sensor.uuid,
      sensorUniqueId: sensor.sensorUniqueId,
      model: sensor.model
    },
    query: {
      from: input.from ?? null,
      to: input.to ?? null,
      limit,
      order
    },
    points
  }
}

export async function countSensorTimeSeries(input: {
  userId?: number
  sensorUuid: string
}) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid: input.sensorUuid },
    select: {
      id: true,
      monitoringPoint: {
        select: {
          machine: { select: { userId: true } }
        }
      }
    }
  })

  if (!sensor) throw new AppError('Sensor não encontrado', 404)

  if (input.userId && sensor.monitoringPoint.machine.userId !== input.userId) {
    throw new AppError('Proibido', 403)
  }

  const [timeSeriesCount, pointsCount] = await prisma.$transaction([
    prisma.telemetryBatch.count({ where: { sensorId: sensor.id } }),
    prisma.telemetryPoint.count({ where: { sensorId: sensor.id } })
  ])

  return {
    timeSeriesCount,
    pointsCount
  }
}

export async function getSensorTimeSeriesMetrics(input: {
  userId?: number
  sensorUuid: string
  from?: Date
  to?: Date
}) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid: input.sensorUuid },
    select: {
      id: true,
      monitoringPoint: {
        select: {
          machine: { select: { userId: true } }
        }
      }
    }
  })

  if (!sensor) throw new AppError('Sensor não encontrado', 404)

  if (input.userId && sensor.monitoringPoint.machine.userId !== input.userId) {
    throw new AppError('Proibido', 403)
  }

  const timestampFilter: { gte?: Date; lte?: Date } = {}
  if (input.from) timestampFilter.gte = input.from
  if (input.to) timestampFilter.lte = input.to

  const where: any = { sensorId: sensor.id }
  if (input.from || input.to) where.timestamp = timestampFilter

  const [agg, lastPoint] = await prisma.$transaction([
    prisma.telemetryPoint.aggregate({
      where,
      _count: { _all: true },
      _min: {
        timestamp: true,
        x: true,
        y: true,
        z: true,
        temperature: true,
        accelerationRms: true
      },
      _max: {
        timestamp: true,
        x: true,
        y: true,
        z: true,
        temperature: true,
        accelerationRms: true
      },
      _avg: {
        x: true,
        y: true,
        z: true,
        temperature: true,
        accelerationRms: true
      }
    }),

    prisma.telemetryPoint.findFirst({
      where,
      orderBy: { timestamp: 'desc' },
      select: {
        timestamp: true,
        x: true,
        y: true,
        z: true,
        temperature: true,
        accelerationRms: true
      }
    })
  ])

  const pointsCount = agg._count._all

  if (pointsCount === 0) {
    return {
      pointsCount: 0,
      range: { from: input.from ?? null, to: input.to ?? null },
      firstTimestamp: null,
      lastTimestamp: null,
      x: { min: null, max: null, avg: null },
      y: { min: null, max: null, avg: null },
      z: { min: null, max: null, avg: null },
      temperature: { min: null, max: null, avg: null },
      accelerationRms: { min: null, max: null, avg: null },
      lastPoint: null
    }
  }

  return {
    pointsCount,
    range: { from: input.from ?? null, to: input.to ?? null },

    firstTimestamp: agg._min.timestamp,
    lastTimestamp: agg._max.timestamp,

    x: { min: agg._min.x, max: agg._max.x, avg: agg._avg.x },
    y: { min: agg._min.y, max: agg._max.y, avg: agg._avg.y },
    z: { min: agg._min.z, max: agg._max.z, avg: agg._avg.z },

    temperature: {
      min: agg._min.temperature,
      max: agg._max.temperature,
      avg: agg._avg.temperature
    },

    accelerationRms: {
      min: agg._min.accelerationRms,
      max: agg._max.accelerationRms,
      avg: agg._avg.accelerationRms
    },

    lastPoint
  }
}

export async function deleteSensorTimeSeries(input: {
  userId?: number
  sensorUuid: string
  from?: Date
  to?: Date
  all?: boolean
}) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid: input.sensorUuid },
    select: {
      id: true,
      monitoringPoint: {
        select: {
          machine: { select: { userId: true } }
        }
      }
    }
  })

  if (!sensor) throw new AppError('Sensor não encontrado', 404)

  if (input.userId && sensor.monitoringPoint.machine.userId !== input.userId) {
    throw new AppError('Proibido', 403)
  }

  const wantsAll = input.all === true
  const wantsRange = !!(input.from || input.to)

  if (!wantsAll && !wantsRange) {
    throw new AppError(
      'Forneça all=true ou um intervalo from/to para deletar séries temporais',
      400
    )
  }

  const timestampFilter: { gte?: Date; lte?: Date } = {}
  if (input.from) timestampFilter.gte = input.from
  if (input.to) timestampFilter.lte = input.to

  const wherePoints: any = { sensorId: sensor.id }
  if (!wantsAll) wherePoints.timestamp = timestampFilter

  const deletedPoints = await prisma.telemetryPoint.deleteMany({
    where: wherePoints
  })

  const deletedEmptyBatches = await prisma.telemetryBatch.deleteMany({
    where: {
      sensorId: sensor.id,
      points: { none: {} }
    }
  })

  return {
    deletedPoints: deletedPoints.count,
    deletedBatches: deletedEmptyBatches.count,
    mode: wantsAll ? 'all' : 'range',
    range: {
      from: input.from ?? null,
      to: input.to ?? null
    }
  }
}

export async function deleteTelemetryBatch(input: {
  userId?: number
  batchUuid: string
}) {
  const batch = await prisma.telemetryBatch.findUnique({
    where: { uuid: input.batchUuid },
    select: {
      id: true,
      uuid: true,
      sensor: {
        select: {
          monitoringPoint: {
            select: { machine: { select: { userId: true } } }
          }
        }
      }
    }
  })

  if (!batch) throw new AppError('Lote de telemetria não encontrado', 404)

  if (
    input.userId &&
    batch.sensor.monitoringPoint.machine.userId !== input.userId
  ) {
    throw new AppError('Proibido', 403)
  }

  const pointsInBatch = await prisma.telemetryPoint.count({
    where: { batchId: batch.id }
  })

  await prisma.telemetryBatch.delete({
    where: { id: batch.id }
  })

  return {
    batchUuid: batch.uuid,
    deletedPoints: pointsInBatch
  }
}
