import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDTO } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Public } from '../app/app.controller';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMachineDto: CreateMachineDTO, ) {
    return await this.machinesService.create(createMachineDto);
  }

  @Get()
  async findAll() {
    return await this.machinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    return this.machinesService.update(+id, updateMachineDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.machinesService.remove(+id);
  }
}
