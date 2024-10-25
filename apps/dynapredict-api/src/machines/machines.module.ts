import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService, PrismaService],
})
export class MachinesModule {}
