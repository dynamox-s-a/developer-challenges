import { Module } from '@nestjs/common';
import { MonitoringPointsModule } from '../monitoring-points/monitoring-points.module';
import { MachinesController } from './machines.controller';
import { MachinesRepository } from './machines.repository';
import { MachinesService } from './machines.service';

@Module({
  imports: [MonitoringPointsModule],
  controllers: [MachinesController],
  providers: [MachinesService, MachinesRepository],
})
export class MachinesModule {}
