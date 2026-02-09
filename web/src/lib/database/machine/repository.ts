import type { IMachine, MachineDTO } from './schema'
import Machine from './schema'

export class MachineRepository {
  async create(machineDto: MachineDTO): Promise<IMachine | null> {
    // pass DTO
    // validate same name
    // create machine
    // return createdDocument
    const validateMachine = await Machine.findOne({ name: machineDto.Name })
    if (validateMachine) return null

    const machine = await new Machine(machineDto)
    const savedMachine = await machine.save()

    return savedMachine.toObject() as IMachine
  }

  async delete(machineId: string): Promise<boolean> {
    // pass MachineId
    // delete SensorsByMachineId
    // delete MonitoringPointsByMachineId
    // return true if OKAY, false if not
    return false
  }

  async update(): Promise<IMachine> {
    // pass new machine DTO
    // find old machine document
    // verify if old machine has conflitant types with
    //sensor and MP's:
    // [1] Machine PUMP CANT have Sensors with type TcAg OR TcAs, must be HF+
    // return new machine document
  }
}
