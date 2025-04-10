import { Module } from '@nestjs/common';
import { SensorModelController } from './sensor-model.controller';
import { SensorModelService } from './sensor-model.service';

@Module({
  controllers: [SensorModelController],
  providers: [SensorModelService],
})
export class SensorModelModule {}
