import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MachineModule } from './modules/machine/machine.module';
import { MonitoringPointModule } from './modules/monitoring-point/monitoring-point.module';



@Module({
  imports: [PrismaModule, MachineModule, MonitoringPointModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
