import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';

@Module({
  controllers: [MachineController],
  providers: [MachineService],
})
export class MachineModule {}
