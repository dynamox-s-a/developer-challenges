import Machine, { type IMachine } from '../machine/schema'
import { SensorResponse, type ISensorResponse } from './presenter'
import type { ISensor, SensorDTO } from './schema'
import Sensor from './schema'

class SensorRepository {
  async validate(dto: SensorDTO): Promise<IMachine | null> {
    const validation = await Machine.findOne({ _id: dto.Machine })
    return validation ? validation.toObject() : null
  }

  async create(dto: SensorDTO): Promise<ISensorResponse> {
    const validate = await this.validate(dto)
    if (!validate) return SensorResponse(false, 'Erro ao retornar Machine')

    if (validate.Type === 'Pump' && dto.Model !== 'HF+')
      return SensorResponse(
        false,
        'Máquina do tipo PUMP não pode ter sensores: TcAg e TcAs',
      )

    const newSensor = new Sensor(dto)
    const savedSensor = await newSensor.save()
    return SensorResponse(
      true,
      'Sensor criado com sucesso',
      savedSensor.toObject() as ISensor,
    )
  }

  async getByMachineId(id: string): Promise<ISensorResponse> {
    try {
      const sensors = await Sensor.find({ Machine: id }).lean()
      if (!sensors.length) {
        return SensorResponse(
          false,
          'Nenhum sensor encontrado para esta máquina.',
        )
      }
      return SensorResponse(true, 'Sensores encontrados', sensors as ISensor[])
    } catch (error) {
      console.error('Erro ao buscar sensores:', error)
      return SensorResponse(false, 'Erro ao buscar sensores.')
    }
  }
}

const sensorRepository = new SensorRepository()
export default sensorRepository
