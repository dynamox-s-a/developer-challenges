import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET não definido. Configure o .env antes de subir a API.');
        }
        // O cast evita depender do tipo template-literal de expiresIn entre versões do @nestjs/jwt.
        return {
          secret,
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '8h' },
        } as Parameters<typeof JwtModule.register>[0];
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Guard global: toda rota exige JWT, exceto as marcadas com @Public().
    // Ordem relevante: JwtAuthGuard popula request.user; RolesGuard decide a permissão.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
