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
import { AuthenticatedGuard } from '../guard/authenticated.guard';
import { MonitoringPointsService } from './monitoring-points.service';
import { CreateMonitoringPointDto, UpdateMonitoringPointDto } from '@dynamox-challenge/dto';

@Controller('monitoring-points')
@UseGuards(AuthGuard('jwt'), AuthenticatedGuard)
export class MonitoringPointsController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService
  ) {}

  @Post()
  async create(
    @Body() body: CreateMonitoringPointDto,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.monitoringPointsService.create(body);
    return res.status(statusCode).json(data);
  }

  @Get()
  async findAll(
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.monitoringPointsService.findAll();
    return res.status(statusCode).json(data);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.monitoringPointsService.findOne(+id);
    return res.status(statusCode).json(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMonitoringPointDto,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.monitoringPointsService.update(+id, body);
    return res.status(statusCode).json(data);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const { statusCode, data } = await this.monitoringPointsService.remove(+id);
    return res.status(statusCode).json(data);
  }
}
