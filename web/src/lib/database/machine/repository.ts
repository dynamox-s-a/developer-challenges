import { MachineResponse, type IMachineResponse } from './presenter'
import type { IMachine, MachineDTO } from './schema'
import Machine from './schema'

export class MachineRepository {
  async create(machineDto: MachineDTO): Promise<IMachineResponse> {
    // pass DTO
    // validate same name
    // create machine
    // return createdDocument
    const validateMachine = await Machine.findOne({ name: machineDto.Name })
    if (validateMachine)
      return MachineResponse(false, 'Máquina com esse nome já existe.')

    const machine = await new Machine(machineDto)
    const savedMachine = await machine.save()

    return MachineResponse(
      true,
      'Máquina criada com sucesso',
      savedMachine.toObject() as IMachine,
    )
  }

  async delete(machineId: string): Promise<IMachineResponse> {
    // pass MachineId
    // delete SensorsByMachineId
    // delete MonitoringPointsByMachineId
    // return true if OKAY, false if not
    const deletedMachine = await Machine.deleteOne({ _id: machineId })
    // verify if mongoose received the delete process
    if (!deletedMachine.acknowledged)
      return MachineResponse(false, 'Erro ao deletar máquina.')

    return MachineResponse(true, 'Máquina modificada com sucesso')
  }

  async update(
    oldMachineId: string,
    machineDto: MachineDTO,
  ): Promise<IMachineResponse> {
    // pass new machine DTO
    // find old machine document
    // verify if old machine has conflitant types with
    //sensor and MP's:
    // [1] Machine PUMP CANT have Sensors with type TcAg OR TcAs, must be HF+
    // return new machine document
    const validateNewMachine = await Machine.findOne({ name: machineDto.Name })
    if (validateNewMachine)
      return MachineResponse(false, 'Máquina já existente')

    const updateOldMachine = await Machine.updateOne(
      { _id: oldMachineId },
      machineDto,
    )

    if (!updateOldMachine.acknowledged)
      return MachineResponse(false, 'Máquina não alterada')

    return MachineResponse(true, 'Máquina alterada com sucesso')
  }
}
