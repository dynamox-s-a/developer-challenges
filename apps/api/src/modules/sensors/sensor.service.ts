import { AppError } from '../../core/base/AppError'
import { prisma } from '../../core/lib/prisma'

function validateSensorForMachine(
  machineType: string,
  sensorModel: string
): void {
  if (
    machineType === 'Pump' &&
    (sensorModel === 'TcAg' || sensorModel === 'TcAs')
  ) {
    throw new AppError(
      `Sensors of model ${sensorModel} cannot be configured for machines of type Pump`,
      400
    )
  }
}

export async function createSensor(input: {
  sensorUniqueId: string
  model: 'TcAg' | 'TcAs' | 'HF_PLUS'
  monitoringPointUuid: string
}) {
  const monitoringPoint = await prisma.monitoringPoint.findUnique({
    where: { uuid: input.monitoringPointUuid },
    include: {
      machine: true,
      sensor: true
    }
  })

  if (!monitoringPoint) {
    throw new AppError('Monitoring point not found', 404)
  }

  if (monitoringPoint.sensor) {
    throw new AppError(
      'This monitoring point already has a sensor associated',
      400
    )
  }

  validateSensorForMachine(monitoringPoint.machine.type, input.model)

  const existingSensor = await prisma.sensor.findUnique({
    where: { sensorUniqueId: input.sensorUniqueId }
  })

  if (existingSensor) {
    throw new AppError('Sensor Unique ID already exists', 400)
  }

  return prisma.sensor.create({
    data: {
      sensorUniqueId: input.sensorUniqueId,
      model: input.model,
      monitoringPointId: monitoringPoint.id
    },
    select: {
      uuid: true,
      sensorUniqueId: true,
      model: true,
      createdAt: true,
      updatedAt: true,
      monitoringPoint: {
        select: {
          uuid: true,
          name: true,
          machine: {
            select: {
              uuid: true,
              name: true,
              type: true
            }
          }
        }
      }
    }
  })
}

export async function listSensors() {
  return prisma.sensor.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      uuid: true,
      sensorUniqueId: true,
      model: true,
      createdAt: true,
      updatedAt: true,
      monitoringPoint: {
        select: {
          uuid: true,
          name: true,
          machine: {
            select: {
              uuid: true,
              name: true,
              type: true
            }
          }
        }
      }
    }
  })
}

export async function getSensorByUuid(uuid: string) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid },
    select: {
      uuid: true,
      sensorUniqueId: true,
      model: true,
      createdAt: true,
      updatedAt: true,
      monitoringPoint: {
        select: {
          uuid: true,
          name: true,
          machine: {
            select: {
              uuid: true,
              name: true,
              type: true
            }
          }
        }
      }
    }
  })

  if (!sensor) {
    throw new AppError('Sensor not found', 404)
  }

  return sensor
}

export async function updateSensor(
  uuid: string,
  input: { sensorUniqueId?: string; model?: 'TcAg' | 'TcAs' | 'HF_PLUS' }
) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid },
    select: {
      id: true,
      sensorUniqueId: true,
      monitoringPoint: {
        select: {
          machine: {
            select: { type: true }
          }
        }
      }
    }
  })

  if (!sensor) {
    throw new AppError('Sensor not found', 404)
  }

  if (input.model) {
    validateSensorForMachine(sensor.monitoringPoint.machine.type, input.model)
  }

  if (input.sensorUniqueId && input.sensorUniqueId !== sensor.sensorUniqueId) {
    const existingSensor = await prisma.sensor.findUnique({
      where: { sensorUniqueId: input.sensorUniqueId }
    })

    if (existingSensor) {
      throw new AppError('Sensor Unique ID already exists', 400)
    }
  }

  return prisma.sensor.update({
    where: { id: sensor.id },
    data: input,
    select: {
      uuid: true,
      sensorUniqueId: true,
      model: true,
      createdAt: true,
      updatedAt: true
      // monitoringPoint: {
      //   select: {
      //     uuid: true,
      //     name: true,
      //     machine: {
      //       select: {
      //         uuid: true,
      //         name: true,
      //         type: true
      //       }
      //     }
      //   }
      // }
    }
  })
}

export async function deleteSensor(uuid: string) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid },
    select: { id: true }
  })

  if (!sensor) {
    throw new AppError('Sensor not found', 404)
  }

  await prisma.sensor.delete({ where: { id: sensor.id } })
}
