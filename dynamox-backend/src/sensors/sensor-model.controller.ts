import { Controller, Get } from '@nestjs/common';
import { SensorModelService } from './sensor-model.service';

@Controller('sensor-models')
export class SensorModelController {
  constructor(private readonly sensorModelService: SensorModelService) {}

  @Get()
  findAll() {
    return this.sensorModelService.findAll();
  }
}
