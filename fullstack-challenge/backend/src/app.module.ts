import { Module } from '@nestjs/common';
import { MachineController } from './controller/machine.controller';
import { MachineRepository } from './repository/machine.repository';
import { DrizzleService } from './service/drizzle.service';

@Module({
  imports: [],
  controllers: [MachineController],
  providers: [MachineRepository, DrizzleService],
})
export class AppModule {}
