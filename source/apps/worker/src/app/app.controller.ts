import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('telemetry_data')
  async processTelemetry(@Payload() data: { sensorId: string; accelerationValue: number; velocityValue: number; temperatureValue: number; timestamp?: string }) {
    return this.appService.processTelemetry(data);
  }

  @MessagePattern('sensor_update')
  async handleSensorUpdate(@Payload() data: any) {
    return this.appService.handleSensorUpdate(data);
  }
}
