import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';

@Module({
  providers: [MachineService],
  controllers: [MachineController],
})
export class MachineModule {}
