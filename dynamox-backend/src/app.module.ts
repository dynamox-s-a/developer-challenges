import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { SensorsModule } from './sensors/sensors.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, MachinesModule, SensorsModule, PrismaModule],  
})
export class AppModule {}
