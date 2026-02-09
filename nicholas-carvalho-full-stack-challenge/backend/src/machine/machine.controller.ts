import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDTO } from './dto/createMachine.dto';
import { UpdateMachineDTO } from './dto/updateMachine.dto';
import { JWTGuard } from 'src/auth/jwt.guard';

@UseGuards(JWTGuard)
@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) { }

  @Get(":userId")
  async findManyByUser(@Query("userId") userId: string) {
    return await this.machineService.findManyByUser(userId);
  }

  @Get()
  async findManyMachines() {
    return await this.machineService.findManyMachines();
  }

  @Get(":id")
  async findUniqueMachine(@Param("id") id: string) {
    return await this.machineService.findUniqueMachine(id);
  }

  @Post()
  async createMachine(@Body() machine: CreateMachineDTO) {
    return await this.machineService.createMachine(machine);
  }

  @Put(":id")   
  async updateMachine(@Param("id") id: string, @Body() data: UpdateMachineDTO, @Request() req) {
    const userId = req.user.id;
    return await this.machineService.updateMachine(id, data, userId);
  }

  @Delete(":name")
  async deleteMachine(@Param("name") name: string) {
    return await this.machineService.deleteMachineByName(name);
  }
}
