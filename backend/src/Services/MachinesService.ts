import Machine from '../Domain/Machine/Machine';
import IMachine, { ICreateMachineParams } from '../Interfaces/IMachine';
import MachineODM from '../Models/MachineODM';
import SensorODM from '../Models/SensorODM';
import UserODM from '../Models/UserODM';

export default class MachinesService {
  private createMachineDomain(machine: IMachine | null): Machine | null {
    if (machine) {
      return new Machine(
        machine.id,
        machine.name,
        machine.type,
        machine.userId
      );
    }
    return null;
  }

  public async create(machine: ICreateMachineParams) {
    const userODM = new UserODM();
    const user = await userODM.findById(machine.userId);
    if (!user) {
      throw new Error('User id not found.');
    }

    const machineODM = new MachineODM();
    const newMachine = await machineODM.create(machine);
    return this.createMachineDomain(newMachine);
  }

  public async listAll(userId: string) {
    const machineODM = new MachineODM();
    return await machineODM.listAll(userId);
  }

  public async update(machine: IMachine) {
    const machineODM = new MachineODM();
    return await machineODM.update(machine);
  }

  public async delete(id: string) {
    const sensorODM = new SensorODM();
    const sensors = await sensorODM.listAll(id);
    sensors?.forEach((sensor) => {
      sensorODM.delete(sensor.id);
    });

    const machineODM = new MachineODM();
    return await machineODM.delete(id);
  }
}
