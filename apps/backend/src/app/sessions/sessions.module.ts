import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../database/PrismaService';
import { SessionsController } from './sessions.controller';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, PrismaService, JwtService],
})
export class SessionsModule {}
