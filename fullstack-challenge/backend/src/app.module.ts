import { Module } from '@nestjs/common';
import { MachineController } from './modules/machines/machine.controller';
import { MachineRepository } from './repositories/machine.repository';
import { MonitoringPointController } from './modules/monitoring-point/monitoring-point.controller';
import { MonitoringPointRepository } from './repositories/monitoring-point.repository';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DrizzleModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [MachineController, MonitoringPointController],
  providers: [MachineRepository, MonitoringPointRepository],
})
export class AppModule {}
