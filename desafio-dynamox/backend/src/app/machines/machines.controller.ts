import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Prisma } from '@prisma/client';
import { CreateMachineDto } from './dto/create-machine.dto'

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  create(@Body() data: CreateMachineDto) {
    return this.machinesService.create(data);
  }

  @Get()
  findAll() {
    return this.machinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.MachineUpdateInput) {
    return this.machinesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machinesService.remove(id);
  }
}