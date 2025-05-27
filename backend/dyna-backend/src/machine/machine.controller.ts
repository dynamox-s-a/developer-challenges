import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { MachineService } from './machine.service';
// import { CreateMachineDto } from './dto/create-machine.dto';
// import { UpdateMachineDto } from './dto/update-machine.dto';
import { AuthGuard } from 'src/auth/auth.guard';
//import { get } from 'http';
import { CreateMachinesDto } from './dto/machine';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
  //   return this.machineService.update(+id, updateMachineDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.machineService.remove(+id);
  // }
  //@UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() request){
    return request;
  }

//  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() body: CreateMachinesDto){
    return await this.machineService.create(body);
  }
  //@UseGuards(AuthGuard)
  @Delete(':id')
  async deleteMachine(@Param('id',ParseIntPipe) id:number){
    return await this.machineService.delete(id);
  }
}
