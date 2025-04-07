import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SensorsModule } from '../sensors/sensors.module';

@Module({
  imports: [PrismaModule, SensorsModule],
  providers: [MachinesService],
  controllers: [MachinesController],
})
export class MachinesModule {}
