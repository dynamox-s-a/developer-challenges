import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Machine as MachineModel } from '@prisma/client';
import { MachineDto } from '../dto';
import { MachineService } from '../service/machine.service';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  async create(@Body() reqData: { name: string; machineTypeId: number; }): Promise<MachineModel> {
    const { name, machineTypeId } = reqData;
    return this.machineService.createMachine({
      name,
      machineTypeId
    });
  }

  @Get()
  async getList(): Promise<MachineModel[]> {
    return this.machineService.getMachinesList({
      
    });   
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<MachineModel> {
    return this.machineService.getMachine({ id: Number(id) });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() reqData: { name: string; machineTypeId: number; }): Promise<MachineModel> {
    const { name, machineTypeId } = reqData;
    return this.machineService.updateMachine({
      where: { id: Number(id) },
      data: {
        name,
        machineTypeId
      }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MachineModel> {
    return this.machineService.deleteMachine({ id: Number(id) });
  }
}