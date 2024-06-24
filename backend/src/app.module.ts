import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { MachineModule } from './machine/machine.module';
import { SensorModule } from './sensor/sensor.module';

@Module({
	imports: [
		PrismaModule, 
		UserModule, 
		AuthModule, 
		MachineModule, 
		SensorModule
	],
	controllers: [AppController],
	providers: [AppService, {
		provide: 'APP_GUARD',
		useClass: JwtAuthGuard
	}]
})
export class AppModule { }
