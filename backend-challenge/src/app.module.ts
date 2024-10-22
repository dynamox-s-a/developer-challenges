import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MachineModule } from './machine/machine.module';
import { SensorsModule } from './sensors/sensors.module';
import { MonitoringPointModule } from './monitoring-point/monitoring-point.module';

@Module({
  imports: [AuthModule, UserModule, MachineModule, SensorsModule, MonitoringPointModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
