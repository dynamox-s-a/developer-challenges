import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { MachineModule } from './machine/machine.module'
import { MachineController } from './machine/machine.controller'
import { MachineService } from './machine/machine.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, MachineModule],
  controllers: [AppController, MachineController],
  providers: [AppService, MachineService]
})
export class AppModule {}
