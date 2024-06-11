import { Schema } from 'mongoose';
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
}
