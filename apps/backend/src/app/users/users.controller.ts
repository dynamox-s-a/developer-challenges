import {
  Res,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OwnGuard } from '../guard/own.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from '@dynamox-challenge/dto';
import { UpdateUserDto } from '@dynamox-challenge/dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() body: CreateUserDto,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.usersService.create(body);
    return res.status(statusCode).json(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnGuard)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.usersService.update(+id, body);
    return res.status(statusCode).json(data);
  }
}
