import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Machine } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { AssignSensorDto } from '../sensors/dto/assign-sensor.dto';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(
    private machinesService: MachinesService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async create(@Body() data: { name: string; type: string }): Promise<Machine> {
    return this.machinesService.create(data);
  }

  @Post('machines')
  async addSensor(
    @Param('id') machineId: string,
    @Body() dto: AssignSensorDto,
  ) {
    return this.machinesService.assignSensor({
      ...dto,
      machineId,
    });
  }

  @Get()
  async findAll(): Promise<Machine[]> {
    return this.machinesService.findAll();
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }

  @Get(':id/sensors')
  async getSensors(@Param('id') machineId: string) {
    return this.prisma.sensor.findMany({
      where: {
        monitoringPoint: {
          machineId: machineId,
        },
      },
      include: {
        monitoringPoint: {
          include: {
            machine: true,
          },
        },
      },
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; type?: string },
  ): Promise<Machine> {
    return this.machinesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Machine> {
    return this.machinesService.delete(id);
  }
}
