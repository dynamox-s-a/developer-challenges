import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { MachineRepository } from '../repository/machine.repository';

@Controller("machines")
export class MachineController {
  constructor(private readonly machineRepository: MachineRepository) {}

  @Get()
  get(): any {
    return this.machineRepository.list();
  }

  @Post()
  post(): string {
    return "post";
  }

  @Put()
  put(): string {
    return "put";
  }

  @Delete()
  delete(): string {
    return "delete";
  }
}
