import { Module } from '@nestjs/common';
import { AuthService } from './user.service';
import { AuthController } from './user.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
