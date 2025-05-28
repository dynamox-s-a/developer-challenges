import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { MachineService } from './machine.service';
// import { CreateMachineDto } from './dto/create-machine.dto';
// import { UpdateMachineDto } from './dto/update-machine.dto';
import { AuthGuard } from 'src/auth/auth.guard';
//import { get } from 'http';
import { CreateMachinesDto, CreatePointOfMonitoringDTO } from './dto/machine';
import { UpdateMachinesDTO } from './dto/update-machine';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) { }

  // @Post()
  // create(@Body() createMachineDto: CreateMachineDto) {
  //   return this.machineService.create(createMachineDto);
  // }

  // @Get()
  // findAll() {
  //   return this.machineService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.machineService.findOne(+id);
  // }


  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.machineService.remove(+id);
  // }
  //@UseGuards(AuthGuard)
  // @Get()
  // async getAll(@Request() request){
  //   return request;
  // }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
  //   return this.machineService.update(+id, updateMachineDto);
  // }

  //  @UseGuards(AuthGuard)
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
  
}
