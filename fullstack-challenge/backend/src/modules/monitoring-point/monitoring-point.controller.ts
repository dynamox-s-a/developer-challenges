import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { MonitoringPointRepository } from '../../repositories/monitoring-point.repository';
import type { CreateMonitoringPointDto, UpdateMonitoringPointDto } from './monitoring-point.dto';
import type { Response } from 'express';

@Controller('monitoring-points')
export class MonitoringPointController {
  constructor(private readonly monitoringPointRepository: MonitoringPointRepository) {}

  @Get()
  list(): any {
    return this.monitoringPointRepository.list();
  }

  @Get(':id')
  async find(@Param('id') id: string, @Res() response: Response) {
    if (!id) {
      return response.status(400).send('MonitoringPoint id is required.');
    }

    if (!Number.isInteger(+id)) {
      return response.status(400).send('MonitoringPoint id should be a number.');
    }

    const monitoringPoint = await this.monitoringPointRepository.find(+id);

    if (!monitoringPoint) {
      return response.status(500).send('Error on finding monitoring point.');
    }

    return response.status(200).send(monitoringPoint);
  }

  @Post()
  async create(
    @Body() createMonitoringPointDto: CreateMonitoringPointDto,
    @Res() response: Response,
  ) {
    if (!createMonitoringPointDto) {
      return response.status(400).send('MonitoringPoint body is required.');
    }

    if (!createMonitoringPointDto.name) {
      return response.status(400).send('MonitoringPoint name is required.');
    }

    if (!createMonitoringPointDto.type) {
      return response.status(400).send('MonitoringPoint type is required.');
    }

    if (
      createMonitoringPointDto.type !== 'TcAg' && 
      createMonitoringPointDto.type !== 'TcAs' &&
      createMonitoringPointDto.type !== 'HF+') {
      return response
        .status(400)
        .send('Invalid monitoring point type. Should be "Fan" or "Pump"');
    }

    const success = await this.monitoringPointRepository.create(
      createMonitoringPointDto.name,
      createMonitoringPointDto.type,
      createMonitoringPointDto.machineId
    );

    if (!success) {
      return response.status(500).send('Error on monitoring point creation.');
    }

    return response.status(201).send();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMonitoringPointDto: UpdateMonitoringPointDto,
    @Res() response: Response,
  ) {
    if (!id) {
      return response.status(400).send('MonitoringPoint id is required.');
    }

    if (!Number.isInteger(+id)) {
      return response.status(400).send('MonitoringPoint id should be a number.');
    }

    if (!updateMonitoringPointDto) {
      return response.status(400).send('MonitoringPoint body is required.');
    }

    const { name, type } = updateMonitoringPointDto;

    if (!name) {
      return response.status(400).send('MonitoringPoint name is required.');
    }

    if (!type) {
      return response.status(400).send('MonitoringPoint type is required.');
    }

    if (type !== 'TcAg' && type !== 'TcAs' && type !== 'HF+') {
      return response
        .status(400)
        .send('Invalid monitoring point type. Should be "TcAg", "TcAs" or "HF+"');
    }

    const monitoringPoint = await this.monitoringPointRepository.find(+id);

    if (!monitoringPoint) {
      return response.status(404).send('MonitoringPoint not found.');
    }

    const success = await this.monitoringPointRepository.update(+id, name, type);

    if (!success) {
      return response.status(500).send('Error on monitoring point update.');
    }

    return response.status(200).send({ id: +id, name, type });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() response: Response) {
    if (!id) {
      return response.status(400).send('MonitoringPoint id is required.');
    }

    if (!Number.isInteger(+id)) {
      return response.status(400).send('MonitoringPoint id should be a number.');
    }

    const monitoringPoint = await this.monitoringPointRepository.find(+id);

    if (!monitoringPoint) {
      return response.status(404).send('MonitoringPoint not found.');
    }

    const success = await this.monitoringPointRepository.delete(+id);

    if (!success) {
      return response.status(500).send('Error on monitoring point delete.');
    }

    return response.status(200).send();
  }
}
