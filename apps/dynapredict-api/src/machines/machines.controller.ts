import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MachineType } from '@prisma/client';
import { AuthUser, User } from '../auth/user.decorator';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachinesService } from './machines.service';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @Get('types')
  getTypes(): { types: string[] } {
    return { types: Object.values(MachineType) };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) machineId: number,
    @User() user: AuthUser
  ) {
    return await this.machinesService.findOne(machineId, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) machineId: number,
    @User() user: AuthUser,
    @Body() updateMachineDto: UpdateMachineDto
  ) {
    return await this.machinesService.update(
      machineId,
      user.id,
      updateMachineDto
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) machineId: number,
    @User() user: AuthUser
  ) {
    return await this.machinesService.remove(machineId, user.id);
  }
}
