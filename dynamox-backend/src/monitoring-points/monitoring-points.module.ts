import { Module } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-points.service';
import { MonitoringPointController } from './monitoring-points.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MonitoringPointController],
  providers: [MonitoringPointService],
})
export class MonitoringPointModule {}
