import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_CONFIG, readAuthConfig, type AuthConfig } from '../config/auth-config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      extraProviders: [{ provide: AUTH_CONFIG, useFactory: () => readAuthConfig() }],
      inject: [AUTH_CONFIG],
      useFactory: (config: AuthConfig) => ({ secret: config.jwtSecret }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_CONFIG, useFactory: () => readAuthConfig() },
    AuthService,
    UsersRepository,
    // Registered here, it guards every route of the application.
    { provide: APP_GUARD, useClass: SessionGuard },
  ],
})
export class AuthModule {}
