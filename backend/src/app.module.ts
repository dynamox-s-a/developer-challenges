import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MachineModule } from './machine/machine.module';
import { MonitoringPointModule } from './monitoring-point/monitoring-point.module';
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    MachineModule,
    MonitoringPointModule,
    SensorModule,
  ],
})
export class AppModule {}
