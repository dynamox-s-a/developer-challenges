import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';

@Module({
  providers: [MachineService],
  controllers: [MachineController]
})
export class MachineModule {}
