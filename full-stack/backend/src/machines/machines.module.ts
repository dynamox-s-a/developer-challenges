import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService],
})
export class MachinesModule {}
