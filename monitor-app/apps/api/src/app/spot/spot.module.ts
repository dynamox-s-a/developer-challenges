import { Module } from '@nestjs/common'
import { SpotService } from './spot.service'
import { SpotController } from './spot.controller'
import { MachineService } from '../machine/machine.service'

@Module({
  controllers: [SpotController],
  providers: [SpotService, MachineService]
})
export class SpotModule {}
