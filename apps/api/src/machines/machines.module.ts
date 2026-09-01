import { Module } from '@nestjs/common';

import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService],
})
export class MachinesModule {}
