import { Module } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-point.service';
import { MonitoringPointController } from './monitoring-point.controller';

@Module({
  controllers: [MonitoringPointController],
  providers: [MonitoringPointService],
})
export class MonitoringPointModule {}
