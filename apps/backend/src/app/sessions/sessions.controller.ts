import {
  Res,
  Post,
  Body,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from '@dynamox-challenge/dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async create(@Body() body: CreateSessionDto, @Res() res: Response){
    const { statusCode, data } = await this.sessionsService.create(body);
    return res.status(statusCode).json(data);
  }
}
