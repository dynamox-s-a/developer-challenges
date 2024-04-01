import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Machine_Type as Machine_TypeModel } from '@prisma/client';
import { MachineTypeService } from '../service/machine_type.service';

@Controller('machine_type')
export class MachineTypeController {
  constructor(private readonly machineTypeService: MachineTypeService) {}

  @Get()
  async getList(): Promise<Machine_TypeModel[]> {
    return this.machineTypeService.getMachineTypesList({
      
    });   
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Machine_TypeModel> {
    return this.machineTypeService.getMachineType({ id: Number(id) });
  }

}