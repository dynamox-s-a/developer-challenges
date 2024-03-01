import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import BaseRepository from '../core/base.repository';
import Sensor from '../models/sensor.model';

@Injectable()
export default class SensorRepository extends BaseRepository<Sensor> {
  constructor(@InjectModel(Sensor.name) model) {
    super(model, (param: string) => ({
      name: { $regex: param, $options: 'i' },
    }));
  }

  async selectSensors({
    criteria = '',
  }: {
    criteria?: string;
  }): Promise<Sensor[]> {
    const result = await this.aggregate([
      {
        $match: {
          deleted: false,
          $or: [{ name: { $regex: criteria.trim(), $options: 'i' } }],
        },
      },
      {
        $project: {
          _id: 1,
          // deleted: 1,
          name: 1,
          // createdAt: 1,
          // updatedAt: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);
    return result;
  }
}
