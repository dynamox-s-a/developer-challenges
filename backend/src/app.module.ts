import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { MachineController } from './controller/machine.controller';
import { MonitoringPointController } from './controller/monitoring_point.controller';
import { AppService } from './service/app.service';
import { MachineService } from './service/machine.service';
import { PrismaService } from './service/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, MachineController, MonitoringPointController],
  providers: [AppService, MachineService, PrismaService],
})
export class AppModule {}
