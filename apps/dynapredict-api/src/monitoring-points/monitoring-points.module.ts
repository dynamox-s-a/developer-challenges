import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

@Module({
  controllers: [MonitoringPointsController],
  providers: [PrismaService, MonitoringPointsService],
})
export class MonitoringPointsModule {}
