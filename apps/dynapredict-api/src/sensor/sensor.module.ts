import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  controllers: [SensorController],
  providers: [SensorService, PrismaService],
})
export class SensorModule {}
