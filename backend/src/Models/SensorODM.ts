import { Schema, isObjectIdOrHexString } from 'mongoose';
import AbstractODM from './AbstractODM';
import ISensor, { ICreateSensorParams } from '../Interfaces/ISensor';

export default class SensorODM extends AbstractODM<ISensor> {
  constructor() {
    const schema = new Schema<ISensor>({
      name: { type: String, required: true },
      type: { type: String, required: true },
      machineId: { type: String, required: true },
    });
    super(schema, 'Sensor');
  }

  public async create(sensor: ICreateSensorParams): Promise<ISensor> {
    const { _id, name, type, machineId } = await this.model.create(sensor);
    return { id: _id.toHexString(), name, type, machineId };
  }

  public async listAll(machineId: string): Promise<ISensor[] | null> {
    const sensors = await this.model.find({ machineId });
    return sensors.map((m) => ({
      id: m._id.toHexString(),
      name: m.name,
      type: m.type,
      machineId: m.machineId,
    }));
  }

  public async update(sensor: ISensor): Promise<ISensor | null> {
    if (!isObjectIdOrHexString(sensor.id)) {
      throw new Error('Invalid sensor ID');
    }

    const updatedSensor = await this.model.findByIdAndUpdate(
      { _id: sensor.id },
      { name: sensor.name, type: sensor.type },
      { new: true }
    );
    if (updatedSensor) {
      const { _id, name, type, machineId } = updatedSensor;

      return new Promise((resolve) => {
        resolve({ id: _id.toHexString(), name, type, machineId });
      });
    }
    throw new Error('Sensor ID not found');
  }

  public async delete(id: string): Promise<string | null> {
    if (!isObjectIdOrHexString(id)) {
      throw new Error('Invalid sensor ID');
    }

    const deleted = await this.model.findByIdAndDelete(id);

    if (!deleted?.name) {
      throw new Error('Sensor ID not found');
    }
    return `deleted: ${deleted?.name} of type: ${deleted.type}`;
  }
}
