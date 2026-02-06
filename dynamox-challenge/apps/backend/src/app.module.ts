import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MachineModule } from './modules/machine/machine.module';
import { MonitoringPointModule } from './modules/monitoring-point/monitoring-point.module';
import { SensorModule } from './modules/sensor/sensor.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [PrismaModule, MachineModule, MonitoringPointModule, SensorModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
