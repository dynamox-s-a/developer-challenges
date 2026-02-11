/** biome-ignore-all lint/style/useTemplate: Nada a ver */
import {
  MachinePresenterSchema,
  type CreateMachineDto,
  type MachineResponse,
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
    const machine = await Machine.findOne({ _id: machineId })

    if (!machine) return { success: false, message: 'Maquina não encontrada.' }

    const parsedMachine = MachinePresenterSchema.safeParse(machine.toObject())

    if (!parsedMachine.success)
      return { success: false, message: 'Erro ao parsear o valor' }

    return {
      success: true,
      message: 'Máquina encontrada com sucesso',
      data: parsedMachine.data,
    }
  }

  async create(dto: CreateMachineDto): Promise<MachineResponse> {
    // pass DTO
    // validate same name
    // create machine
    // return createdDocument
    const machine = await new Machine({ Name: dto.name, Type: dto.type })
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
      machine: machineId,
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
    oldMachineId: string,
    machineDto: CreateMachineDto,
  ): Promise<MachineResponse> {
    // pass new machine DTO
    // find old machine document
    // verify if old machine has conflitant types with
    //sensor and MP's:
    // [1] Machine PUMP CANT have Sensors with type TcAg OR TcAs, must be HF+
    // return new machine document
    const updateOldMachine = await Machine.updateOne(
      { _id: oldMachineId },
      machineDto,
    )

    if (!updateOldMachine.acknowledged)
      return { success: false, message: 'Falha ao atualizar máquina.' }

    return { success: true, message: 'Máquina atualizada com sucesso!' }
  }
}

const machineRepository = new MachineRepository()
export default machineRepository
