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
import * as bodyParser from 'body-parser';
import * as mongooseDelete from 'mongoose-delete';
import * as mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import AuthController from './controllers/auth.controller';
import UserController from './controllers/user.controller';
import JwtGuard from './core/auth-guard/jwt.guard';
import BasicStrategy from './core/auth-strategies/basic.strategy';
import User, { UserSchema } from './models/user.model';
import UserRepository from './repositories/user.repository';
import AuthService from './services/auth.service';
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController, UserController],
  providers: [
    { provide: APP_GUARD, useClass: JwtGuard },
    AuthService,
    BasicStrategy,
    UserRepository,
    UserService,
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
