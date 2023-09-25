import { Module } from '@nestjs/common'

import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { MachineModule } from './machine/machine.module'
import { SpotModule } from './spot/spot.module'
import { LoginModule } from './login/login.module'

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
