import { Module } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-point.service';
import { MonitoringPointController } from './monitoring-point.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MonitoringPointController],
  providers: [MonitoringPointService, PrismaService],
})
export class MonitoringPointModule {}
