import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from '../guard/jwt.strategy';
import { UsersController } from './users.controller';
import { PrismaService } from '../database/PrismaService';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtStrategy],
})
export class UsersModule {}
