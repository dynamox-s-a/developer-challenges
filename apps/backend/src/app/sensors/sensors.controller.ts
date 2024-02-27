import {
  Get,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SensorsService } from './sensors.service';
import { AuthenticatedGuard } from '../guard/authenticated.guard';
import { CreateSensorDto, UpdateSensorDto } from '@dynamox-challenge/dto';

@Controller('sensors')
@UseGuards(AuthGuard('jwt'), AuthenticatedGuard)
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  async create(
    @Body() body: CreateSensorDto,
    @Res() res: Response,
  ) {
    const { statusCode, data } = await this.sensorsService.create(body);
    return res.status(statusCode).json(data);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const { statusCode, data } = await this.sensorsService.findAll();
    return res.status(statusCode).json(data);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.sensorsService.findOne(+id);
    return res.status(statusCode).json(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateSensorDto,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.sensorsService.update(+id, body);
    return res.status(statusCode).json(data);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { statusCode, data } = await this.sensorsService.remove(+id);
    return res.status(statusCode).json(data);
  }
}
