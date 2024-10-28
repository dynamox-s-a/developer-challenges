import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Machine } from '@prisma/client';
import { AuthenticatedRequest } from 'src/middlewares/authenticated.request';
import { PrismaMachineRepository } from 'src/repositories/prisma/prisma.machine.repository';
import { PrismaMonitoringPointsRepository } from 'src/repositories/prisma/prisma.monitoring.points';

@Controller('machines')
class MachineController {
  constructor(
    private readonly machineRepository: PrismaMachineRepository,
    private readonly monitoringPointsRepository: PrismaMonitoringPointsRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthenticatedRequest)
  async create(@Body() machine: Omit<Machine, 'id'>) {
    try {
      if (machine.type != 'FAN' && machine.type != 'PUMP') {
        throw new InternalServerErrorException('Invalid machine type. Verify.');
      }
      const existingMachine =
        await this.machineRepository.getByMachine(machine);
      if (existingMachine) {
        throw new InternalServerErrorException('Machine already exists');
      }
      await this.machineRepository.create(machine);
      return {
        status: 'Ok!',
        machine: {
          name: machine.name,
        },
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Error creating the machine, verify!. ' + err,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async findAll() {
    try {
      const machines = await this.machineRepository.getAll();
      return {
        status: 'Ok!',
        machines: machines,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async getMachineById(@Param('id') id: number): Promise<{}> {
    try {
      const machine = await this.machineRepository.getById(Number(id));
      if (machine == null) {
        throw new InternalServerErrorException('Machine not found');
      } else {
        return {
          status: 'Ok!',
          machine: machine,
        };
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async update(@Body() machine: Machine) {
    try {
      const existingMachine = await this.machineRepository.getById(machine.id);
      if (!existingMachine) {
        throw new InternalServerErrorException('Machine not found');
      }
      if (machine.type != 'FAN' && machine.type != 'PUMP') {
        throw new InternalServerErrorException('Invalid machine type. Verify.');
      }
      const machineWithSameName =
        await this.machineRepository.getByMachine(machine);
      if (machineWithSameName && machineWithSameName.id !== machine.id) {
        throw new InternalServerErrorException(
          'Machine name already exists. Choose another name.',
        );
      }

      await this.machineRepository.update(machine);

      return {
        status: 'Ok!',
        message: 'Machine updated successfully.',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Error updating the machine, verify!. ' + err,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async delete(@Param('id') id: number) {
    try {
      const machine = await this.machineRepository.getById(Number(id));

      if (!machine) {
        throw new InternalServerErrorException('Machine not found');
      }

      const hasMonitoringPoints =
        await this.monitoringPointsRepository.getByMachine(Number(id));

      if (hasMonitoringPoints) {
        throw new InternalServerErrorException(
          'Cannot delete machine; it is associated with monitoring points.',
        );
      }

      await this.machineRepository.delete(Number(id));

      return {
        status: 'Ok!',
        message: 'Machine deleted successfully',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Error deleting the machine, verify! ' + err,
      );
    }
  }
}
export default MachineController;
