/** biome-ignore-all lint/style/useTemplate: Nada a ver */
import {
  MachinePresenterSchema,
  type CreateMachineDto,
  type MachineResponse,
  type UpdateMachineDto,
} from '@/types/zod/machine'
import MonitoringPoint from '../monitoring_point/schema'
import Sensor from '../sensor/schema'
import Machine, { type IMachine } from './schema'
import {
  toMachinePresenter,
  toMachinePresenters,
} from '@/types/zod/presenter/toMachine'

export class MachineRepository {
  async getAllMachines(): Promise<MachineResponse> {
    const machines = await Machine.find().lean({ getters: true })
    if (!machines.length)
      return { success: false, message: 'Nenhum dado retornado.' }

    const parsed = toMachinePresenters(machines as IMachine[])

    return {
      success: true,
      message: 'Dados recebidos com sucesso',
      data: parsed,
    }
  }

  async getById(machineId: string): Promise<MachineResponse> {
    const machine = await Machine.findOne({ _id: machineId }).lean()

    if (!machine) return { success: false, message: 'Maquina não encontrada.' }

    const parsedMachine = toMachinePresenter(machine as IMachine)

    return {
      success: true,
      message: 'Máquina encontrada com sucesso',
      data: parsedMachine,
    }
  }

  async create(dto: CreateMachineDto): Promise<MachineResponse> {
    // pass DTO
    // validate same name
    // create machine
    // return createdDocument
    const machine = await new Machine({ Name: dto.Name, Type: dto.Type })
    const savedMachine = await machine.save()

    const machineObj = savedMachine.toObject()

    const machinePresenter = toMachinePresenter(machineObj as IMachine)

    return {
      success: true,
      message: 'Máquina cadastrada com sucesso',
      data: machinePresenter,
    }
  }

  async delete(machineId: string): Promise<MachineResponse> {
    // pass MachineId
    // delete SensorsByMachineId
    // delete MonitoringPointsByMachineId
    // return true if OKAY, false if not
    const deleteMonitoringPoints = await MonitoringPoint.deleteMany({
      Machine: machineId,
    })

    if (!deleteMonitoringPoints.acknowledged)
      return { success: false, message: 'Monitoring points não deletados' }

    const deleteSensors = await Sensor.deleteMany({
      Machine: machineId,
    })

    if (!deleteSensors.acknowledged)
      return { success: false, message: 'Sensores não deletados' }

    const deletedMachine = await Machine.deleteOne({ _id: machineId })

    if (!deletedMachine.acknowledged)
      return { success: false, message: 'Máquina não deletada.' }

    return { success: true, message: 'Máquina deletada com sucesso' }
  }

  async update(
    machineId: string,
    machineDto: UpdateMachineDto,
  ): Promise<MachineResponse> {
    if (Object.keys(machineDto).length === 0) {
      return {
        success: false,
        message: 'Nenhum dado enviado para atualização.',
      }
    }

    try {
      const updatedMachine = await Machine.findByIdAndUpdate(
        machineId,
        { $set: machineDto },
        {
          after: true,
          runValidators: true,
          lean: true,
        },
      )

      if (!updatedMachine) {
        return {
          success: false,
          message: 'Máquina não encontrada.',
        }
      }

      const presenter = toMachinePresenter(updatedMachine as IMachine)
      const parsed = MachinePresenterSchema.safeParse(presenter)

      if (!parsed.success)
        return {
          success: false,
          message: 'Erro ao parsear os dados: ' + parsed.error.message,
        }

      return {
        success: true,
        message: 'Máquina atualizada com sucesso!',
        data: presenter,
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar a máquina',
      }
    }
  }
}

const machineRepository = new MachineRepository()
export default machineRepository
