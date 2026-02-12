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
      `Sensores do modelo ${sensorModel} não podem ser configurados para máquinas do tipo Pump`,
      400
    )
  }
}

export async function createSensor(
  input: {
    sensorUniqueId: string
    model: 'TcAg' | 'TcAs' | 'HF_PLUS'
    monitoringPointUuid: string
  },
  userId: number
) {
  const monitoringPoint = await prisma.monitoringPoint.findUnique({
    where: { uuid: input.monitoringPointUuid },
    include: {
      machine: { select: { type: true, userId: true } },
      sensor: { select: { id: true } }
    }
  })

  if (!monitoringPoint) {
    throw new AppError('Ponto de monitoramento não encontrado', 404)
  }

  if (monitoringPoint.machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode criar sensores para pontos de monitoramento de suas próprias máquinas',
      403
    )
  }

  if (monitoringPoint.sensor) {
    throw new AppError(
      'Este ponto de monitoramento já possui um sensor associado',
      400
    )
  }

  validateSensorForMachine(monitoringPoint.machine.type, input.model)

  const existingSensor = await prisma.sensor.findUnique({
    where: { sensorUniqueId: input.sensorUniqueId }
  })

  if (existingSensor) {
    throw new AppError('ID único do sensor já existe', 400)
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

export async function listSensors(userId: number) {
  return prisma.sensor.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      monitoringPoint: {
        machine: { userId }
      }
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
    throw new AppError('Sensor não encontrado', 404)
  }

  return sensor
}

export async function updateSensor(
  uuid: string,
  input: { sensorUniqueId?: string; model?: 'TcAg' | 'TcAs' | 'HF_PLUS' },
  userId: number
) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid },
    select: {
      id: true,
      sensorUniqueId: true,
      monitoringPoint: {
        select: {
          machine: {
            select: { type: true, userId: true }
          }
        }
      }
    }
  })

  if (!sensor) {
    throw new AppError('Sensor não encontrado', 404)
  }

  if (sensor.monitoringPoint.machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode atualizar sensores de suas próprias máquinas',
      403
    )
  }

  if (input.model) {
    validateSensorForMachine(sensor.monitoringPoint.machine.type, input.model)
  }

  if (input.sensorUniqueId && input.sensorUniqueId !== sensor.sensorUniqueId) {
    const existingSensor = await prisma.sensor.findUnique({
      where: { sensorUniqueId: input.sensorUniqueId }
    })

    if (existingSensor) {
      throw new AppError('ID único do sensor já existe', 400)
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

export async function deleteSensor(uuid: string, userId: number) {
  const sensor = await prisma.sensor.findUnique({
    where: { uuid },
    select: {
      id: true,
      monitoringPoint: {
        select: {
          machine: {
            select: { userId: true }
          }
        }
      }
    }
  })

  if (!sensor) {
    throw new AppError('Sensor não encontrado', 404)
  }

  if (sensor.monitoringPoint.machine.userId !== userId) {
    throw new AppError(
      'Proibido: você só pode deletar sensores de suas próprias máquinas',
      403
    )
  }

  await prisma.sensor.delete({ where: { id: sensor.id } })
}
