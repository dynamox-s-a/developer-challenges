import {
  type CreateSensorDto,
  SensorPresenterSchema,
  type SensorResponse,
} from '@/types/zod/sensor'
import Sensor from './schema'
import machineRepository from '../machine/repository'
import { toSensorPresenters } from '@/types/zod/presenter/toSensor'

class SensorRepository {
  async create(dto: CreateSensorDto): Promise<SensorResponse> {
    const validate = await machineRepository.getById(dto.machine)

    if (!validate.data)
      return { success: false, message: 'Dados da máquina não recebidos' }

    if (!validate.success) return { success: false, message: validate.message }

    if (Array.isArray(validate.data))
      return { success: false, message: 'Formato de dados incorreto' }

    if (validate.data.Type === 'Pump' && dto.model !== 'HF+')
      return {
        success: false,
        message: 'Máquina do tipo PUMP não pode ter sensores: TcAg e TcAs',
      }

    const newSensor = new Sensor(dto)
    const savedSensor = await newSensor.save()
    const parsedSensor = SensorPresenterSchema.safeParse(savedSensor.toObject())

    if (!parsedSensor.success)
      return { success: false, message: 'Erro ao parsear os dados do sensor' }

    return {
      success: true,
      message: 'Sensor criado com sucesso',
      data: parsedSensor.data,
    }
  }

  async getMachineSensors(id: string): Promise<SensorResponse> {
    try {
      const sensors = await Sensor.find({ Machine: id }).lean()
      if (!sensors.length) {
        return {
          success: false,
          message: 'Nenhum sensor encontrado para essa máquina',
        }
      }

      const parsedSensors = toSensorPresenters(sensors)

      return {
        success: true,
        message: 'Sensores encontrados',
        data: parsedSensors,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro geral',
      }
    }
  }
}

const sensorRepository = new SensorRepository()
export default sensorRepository
