import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';

/**
 * The AuthModule is responsible for handling authentication-related functionality.
 * @providers
 * - AuthService: The service responsible for authentication logic.
 * - LocalStrategy: The strategy used for local authentication.
 * - AuthGuard: The guard used to protect routes.
 * @controllers
 * - AuthController: The controller responsible for handling authentication-related requests.
 */
@Module({
  imports: [UserModule],
  providers: [AuthService, LocalStrategy, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
