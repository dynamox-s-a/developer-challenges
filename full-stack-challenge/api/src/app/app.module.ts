import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import bodyParser from 'body-parser';
import mongooseDelete from 'mongoose-delete';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import AuthController from './controllers/auth.controller';
import MachineController from './controllers/machine.controller';
import UserController from './controllers/user.controller';
import JwtGuard from './core/auth-guard/jwt.guard';
import AdminJwtStrategy from './core/auth-strategies/admin-jwt.strategy';
import BasicStrategy from './core/auth-strategies/basic.strategy';
import Machine, { MachineSchema } from './models/machine.model';
import User, { UserSchema } from './models/user.model';
import MachineRepository from './repositories/machine.repository';
import UserRepository from './repositories/user.repository';
import AuthService from './services/auth.service';
import MachineService from './services/machine.service';
import UserService from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '1d', issuer: 'dynamox', algorithm: 'HS256' },
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      autoCreate: true,
      connectionFactory: (connection) => {
        connection.plugin(mongooseLeanVirtuals);
        connection.plugin(mongooseDelete, {
          deletedAt: true,
          overrideMethods: [
            'count',
            'countDocuments',
            'find',
            'findOne',
            'findOneAndUpdate',
            'update',
            'updateMany',
          ],
        });
        return connection;
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Machine.name, schema: MachineSchema },
    ]),
  ],
  controllers: [AuthController, UserController, MachineController],
  providers: [
    { provide: APP_GUARD, useClass: JwtGuard },
    AuthService,
    AdminJwtStrategy,
    BasicStrategy,
    UserRepository,
    UserService,
    MachineService,
    MachineRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(bodyParser.urlencoded({ extended: true }))
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.PUT }
      );
  }
}
