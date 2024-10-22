import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MachineController],
  providers: [MachineService, PrismaService],
})
export class MachineModule {}
