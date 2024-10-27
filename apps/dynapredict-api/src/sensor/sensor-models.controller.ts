import { Controller, Get } from '@nestjs/common';
import { ALLOWED_SENSORS } from './sensor.service';

@Controller('sensor/models')
export class SensorModelsController {
  @Get()
  getSensorsModels() {
    return ALLOWED_SENSORS;
  }
}
