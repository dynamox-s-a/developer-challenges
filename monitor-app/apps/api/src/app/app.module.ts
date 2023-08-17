import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { MachineModule } from './machine/machine.module'
import { MachineController } from './machine/machine.controller'
import { MachineService } from './machine/machine.service'
import { SpotModule } from './spot/spot.module'
import { SpotController } from './spot/spot.controller'
import { SpotService } from './spot/spot.service'
import { LoginModule } from './login/login.module'
import { LoginController } from './login/login.controller'
import { LoginService } from './login/login.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MachineModule,
    SpotModule,
    LoginModule
  ]
})
export class AppModule {}
