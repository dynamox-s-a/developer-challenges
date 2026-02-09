import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MachineModule } from './machine/machine.module';
import { PrismaService } from './prisma/client';
import { MonitoringPointModule } from './monitoringPoint/monitoringPoint.module';
import { SensorModule } from './sensor/sensor.module';
import { SensorDataModule } from './sensorData/sensorData.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    AuthModule,
    MachineModule,
    MonitoringPointModule,
    SensorModule,
    SensorDataModule
  ],
  providers: [PrismaService]
})
export class AppModule { }
