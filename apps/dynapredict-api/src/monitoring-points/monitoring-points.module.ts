import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { GetAllController } from './get-all/get-all.controller';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

@Module({
  controllers: [MonitoringPointsController, GetAllController],
  providers: [PrismaService, MonitoringPointsService],
})
export class MonitoringPointsModule {}
