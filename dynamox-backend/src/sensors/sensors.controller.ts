import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { Sensor } from '@prisma/client';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  async create(@Body() dto: CreateSensorDto): Promise<Sensor> {
    return this.sensorsService.create(dto);
  }

  @Get()
  async findAll(): Promise<Sensor[]> {
    return this.sensorsService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Sensor> {
    return this.sensorsService.delete(id);
  }
}
