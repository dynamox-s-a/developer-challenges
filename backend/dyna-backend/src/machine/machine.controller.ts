import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { MachineService } from './machine.service';
// import { CreateMachineDto } from './dto/create-machine.dto';
// import { UpdateMachineDto } from './dto/update-machine.dto';
import { AuthGuard } from 'src/auth/auth.guard';
//import { get } from 'http';
import { CreateLinksDTO, CreateMachinesDto, CreatePointOfMonitoringDTO } from './dto/machine.dto';
import { UpdateMachinesDTO } from './dto/updates-partial.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) { }

  //@UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() body: CreateMachinesDto) {
    return await this.machineService.create(body);
  }

  //@UseGuards(AuthGuard)
  @Post('create/sensor')
  async createSensor(@Body() body: CreatePointOfMonitoringDTO){
    return await this.machineService.createSensor(body);
  }

  //@UseGuards(AuthGuard)
  @Delete(':id')
  async deleteMachine(@Param('id', ParseIntPipe) id: number) {
    return await this.machineService.delete(id);
  }

  //@UseGuards(AuthGuard)
  @Delete('sensor/:id')
  async deleteSensor(@Param('id', ParseIntPipe) id: number) {
    return await this.machineService.deleteSensor(id);
  }

  //@UseGuards(AuthGuard)
  @Patch('/link/:id')
  async linkMachineToSensor(
    @Param('id') id: string,
    @Body() LinksDTO: CreateLinksDTO){
      return await this.machineService.linkMachineToSensor(Number(id), LinksDTO)
  }


  //@UseGuards(AuthGuard)
  @Patch('name/:id')
  async updateName(
    @Param('id') id: string,
    @Body() UpdateMachinesDTO: UpdateMachinesDTO) {
    return await this.machineService.updateName(Number(id), UpdateMachinesDTO.name);
  }

  @Patch('type/:id')
  async updateType(
    @Param('id') id: string,
    @Body() updateMachinesDTO: UpdateMachinesDTO) {
    return await this.machineService.updateType(Number(id), updateMachinesDTO);
  }

  //@UseGuards(AuthGuard)
  @Get()
  async findAllMachines() {
    return await this.machineService.findAllMachines();
  }

  //@UseGuards(AuthGuard)
  @Get('sensors')
  async findAllSensors() {
    return await this.machineService.findAllSensors();
  }  //@UseGuards(AuthGuard)
  @Get('sensors/paginated')
  async findSensorsPaginated(@Query() paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 5;
    return await this.machineService.findSensorsPaginated(page, limit);
  }
  
  //@UseGuards(AuthGuard)
  @Get('paginated')
  async findMachinesPaginated(@Query() paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 5;
    return await this.machineService.findMachinesPaginated(page, limit);
  }

  //@UseGuards(AuthGuard)
  @Get('sensor/:id')
  async findSensorById(@Param('id', ParseIntPipe) id: number) {
    return await this.machineService.findSensorById(id);
  }

  //@UseGuards(AuthGuard)
  @Get(':id')
  async findMachineById(@Param('id', ParseIntPipe) id: number) {
    return await this.machineService.findMachineById(id);
  }
  
}
