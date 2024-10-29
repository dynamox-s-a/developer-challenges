import { Module } from '@nestjs/common';
import { MonitoringPointsController } from './monitoringPoints.controller';
import { MonitoringPointsService } from './monitoringPoints.service';
import { PrismaModule } from 'modules/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MonitoringPointsService],
  controllers: [MonitoringPointsController],
})
export class MonitoringPointsModule {}