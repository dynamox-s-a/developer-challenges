import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/core/lib/prisma'

async function main() {
  const email = 'admin@dynamox.com'
  const password = 'admin123'
  const name = 'Admin'

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { name, email, passwordHash }
  })

  console.log('User seeded')
  console.log('User:', { email, password })

  await prisma.machine.deleteMany()

  const machineTypes = ['Pump', 'Pump', 'Pump', 'Fan', 'Fan'] as const
  const sensorModels = ['TcAg', 'TcAs', 'HF_PLUS'] as const

  let sensorCounter = 1

  for (let i = 1; i <= 5; i++) {
    const machine = await prisma.machine.create({
      data: {
        name: `Maquina ${i}`,
        type: machineTypes[i - 1],
        userId: user.id
      }
    })

    for (let j = 1; j <= 7; j++) {
      const monitoringPoint = await prisma.monitoringPoint.create({
        data: {
          name: `Ponto ${j} - Maquina ${i}`,
          machineId: machine.id
        }
      })

      let sensorModel: (typeof sensorModels)[number]
      if (machine.type === 'Pump') {
        sensorModel = 'HF_PLUS'
      } else {
        sensorModel = sensorModels[j % 3]
      }

      await prisma.sensor.create({
        data: {
          sensorUniqueId: `SENSOR-${String(sensorCounter).padStart(3, '0')}`,
          model: sensorModel,
          monitoringPointId: monitoringPoint.id
        }
      })

      sensorCounter++
    }
  }

  function computeAccelerationRms(x: number, y: number, z: number) {
    return Math.sqrt(x * x + y * y + z * z)
  }

  function generateTelemetryPoints(params: {
    start: Date
    intervalMinutes: number
    count: number
    baseVibration?: number
    baseTemperature?: number
    tempTrendPerPoint?: number
  }) {
    const {
      start,
      intervalMinutes,
      count,
      baseVibration = 0.12,
      baseTemperature = 42.0,
      tempTrendPerPoint = 0.02
    } = params

    const points: Array<{
      timestamp: Date
      x: number
      y: number
      z: number
      temperature: number
      accelerationRms: number
    }> = []

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(start.getTime() + i * intervalMinutes * 60_000)

      const noise = () => (Math.random() - 0.5) * 0.04 

      const x = Number((baseVibration + noise()).toFixed(4))
      const y = Number((baseVibration * 0.9 + noise()).toFixed(4))
      const z = Number((baseVibration * 1.1 + noise()).toFixed(4))

      const temperature = Number(
        (baseTemperature + i * tempTrendPerPoint + noise()).toFixed(2)
      )

      points.push({
        timestamp,
        x,
        y,
        z,
        temperature,
        accelerationRms: Number(computeAccelerationRms(x, y, z).toFixed(6))
      })
    }

    return points
  }

  async function createTelemetryBatchForSensor(params: {
    sensorId: number
    intervalMinutes: number
    points: ReturnType<typeof generateTelemetryPoints>
  }) {
    const { sensorId, intervalMinutes, points } = params
    const fromTimestamp = points[0].timestamp
    const toTimestamp = points[points.length - 1].timestamp

    await prisma.$transaction(async (tx) => {
      const batch = await tx.telemetryBatch.create({
        data: {
          sensorId,
          intervalMinutes,
          pointsCount: 0,
          fromTimestamp,
          toTimestamp
        },
        select: { id: true }
      })

      const created = await tx.telemetryPoint.createMany({
        data: points.map((p) => ({
          sensorId,
          batchId: batch.id,
          timestamp: p.timestamp,
          x: p.x,
          y: p.y,
          z: p.z,
          temperature: p.temperature,
          accelerationRms: p.accelerationRms
        })),
        skipDuplicates: true
      })

      await tx.telemetryBatch.update({
        where: { id: batch.id },
        data: { pointsCount: created.count }
      })
    })
  }

  const sensorsForTelemetry = await prisma.sensor.findMany({
    take: 3,
    orderBy: { id: 'asc' },
    select: { id: true, sensorUniqueId: true }
  })

  if (sensorsForTelemetry.length === 3) {
    const [sA, sB, sC] = sensorsForTelemetry
    const intervalMinutes = 1
    const pointsPerBatch = 20

    const base = new Date('2026-02-11T10:00:00.000Z')

    for (let k = 0; k < 3; k++) {
      const start = new Date(
        base.getTime() + k * pointsPerBatch * intervalMinutes * 60_000
      )
      const points = generateTelemetryPoints({
        start,
        intervalMinutes,
        count: pointsPerBatch,
        baseVibration: 0.12 + k * 0.02, 
        baseTemperature: 42.0 + k * 0.4 
      })
      await createTelemetryBatchForSensor({
        sensorId: sA.id,
        intervalMinutes,
        points
      })
    }

    for (let k = 0; k < 2; k++) {
      const start = new Date(
        base.getTime() +
          2 * 60_000 +
          k * pointsPerBatch * intervalMinutes * 60_000
      )
      const points = generateTelemetryPoints({
        start,
        intervalMinutes,
        count: pointsPerBatch,
        baseVibration: 0.1 + k * 0.015,
        baseTemperature: 40.5 + k * 0.3
      })
      await createTelemetryBatchForSensor({
        sensorId: sB.id,
        intervalMinutes,
        points
      })
    }
  
    {
      const start = new Date(base.getTime() + 5 * 60_000)
      const points = generateTelemetryPoints({
        start,
        intervalMinutes,
        count: pointsPerBatch,
        baseVibration: 0.08,
        baseTemperature: 39.8
      })
      await createTelemetryBatchForSensor({
        sensorId: sC.id,
        intervalMinutes,
        points
      })
    }

    console.log('Telemetry seeded for sensors:', {
      sensorA: sA.sensorUniqueId,
      sensorB: sB.sensorUniqueId,
      sensorC: sC.sensorUniqueId
    })
  } else {
    console.warn('Telemetry seed skipped: not enough sensors found')
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
