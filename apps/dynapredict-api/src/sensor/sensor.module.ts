import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { SensorModelsController } from './sensor-models.controller';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  controllers: [SensorController, SensorModelsController],
  providers: [SensorService, PrismaService],
})
export class SensorModule {}
