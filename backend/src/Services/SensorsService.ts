import Sensor from '../Domain/Sensor/Sensor';
import ISensor, { ICreateSensorParams } from '../Interfaces/ISensor';
import MachineODM from '../Models/MachineODM';
import SensorODM from '../Models/SensorODM';

export default class SensorsService {
  private createSensorDomain(sensor: ISensor | null): Sensor | null {
    if (sensor) {
      return new Sensor(sensor.id, sensor.name, sensor.type, sensor.machineId);
    }
    return null;
  }

  public async create(sensor: ICreateSensorParams) {
    const machineODM = new MachineODM();
    const machine = await machineODM.findById(sensor.machineId);
    if (!machine) {
      throw new Error('Machine ID not found.');
    }

    const sensorODM = new SensorODM();
    const newSensor = await sensorODM.create(sensor);
    return this.createSensorDomain(newSensor);
  }

  public async listAll(machineId: string) {
    const sensorODM = new SensorODM();
    return await sensorODM.listAll(machineId);
  }

  public async update(sensor: ISensor) {
    const sensorODM = new SensorODM();
    return await sensorODM.update(sensor);
  }

  public async delete(id: string) {
    const sensorODM = new SensorODM();
    return await sensorODM.delete(id);
  }
}
