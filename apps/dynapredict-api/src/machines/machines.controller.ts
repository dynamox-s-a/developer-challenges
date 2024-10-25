import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthUser, User } from '../auth/user.decorator';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachinesService } from './machines.service';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  async create(
    @Body() createMachineDto: CreateMachineDto,
    @User() user: AuthUser
  ) {
    return await this.machinesService.create(createMachineDto, user.id);
  }

  @Get()
  async findAll(@User() user: AuthUser) {
    return await this.machinesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) machineId: number,
    @User() user: AuthUser
  ) {
    const machine = await this.machinesService.findOne(machineId, user.id);
    if (!machine) {
      throw new NotFoundException();
    }
    return machine;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) machineId: number,
    @User() user: AuthUser,
    @Body() updateMachineDto: UpdateMachineDto
  ) {
    const machine = await this.machinesService.update(
      machineId,
      user.id,
      updateMachineDto
    );
    if (!machine) {
      throw new NotFoundException();
    }
    return machine;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) machineId: number,
    @User() user: AuthUser
  ) {
    const machine = await this.machinesService.remove(machineId, user.id);
    if (!machine) {
      throw new NotFoundException();
    }
    return machine;
  }
}
