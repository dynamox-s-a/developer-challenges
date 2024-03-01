import { Inject, Injectable } from '@nestjs/common';
import BaseService from '../core/base.service';
import Sensor from '../models/sensor.model';
import SensorRepository from '../repositories/sensor.repository';

@Injectable()
export default class SensorService extends BaseService<Sensor> {
  constructor(@Inject(SensorRepository) repository) {
    super(repository);
  }

  async selectSensors({ criteria }: { criteria: string }): Promise<Sensor[]> {
    return (<SensorRepository>this.repository).selectSensors({ criteria });
  }
}
