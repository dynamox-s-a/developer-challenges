import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PointsService } from './points.service';
import { Prisma } from '@prisma/client';
import { CreatePointDto } from '../points/dto/create-point.dto'

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  create(@Body() data: CreatePointDto) {
    return this.pointsService.create(data);
  }

  @Get()
  findAll() {
    return this.pointsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsService.remove(id);
  }
}