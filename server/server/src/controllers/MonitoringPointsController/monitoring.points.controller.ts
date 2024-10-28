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
import { MonitoringPoints } from '@prisma/client';
import { AuthenticatedRequest } from 'src/middlewares/authenticated.request';
import { PrismaMachineRepository } from 'src/repositories/prisma/prisma.machine.repository';
import { PrismaMonitoringPointsRepository } from 'src/repositories/prisma/prisma.monitoring.points';
import Sensor from 'src/VOs/sensors.vo';

@Controller('monitoringPoints')
class MonitoringPointsController {
  constructor(
    private readonly monitoringPointRepository: PrismaMonitoringPointsRepository,
    private readonly machinesRepository: PrismaMachineRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthenticatedRequest)
  async create(@Body() monitoringPoint: Omit<MonitoringPoints, 'id'>) {
    const existingMonitoringPoint =
      await this.monitoringPointRepository.getByMonitoringPoints(
        monitoringPoint,
      );
    if (existingMonitoringPoint) {
      throw new InternalServerErrorException('Monitoring point already exists');
    }

    try {
      await this.monitoringPointRepository.create(monitoringPoint);
      return {
        status: 'Ok!',
        monitoringPoint: {
          name: monitoringPoint.name,
        },
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Error creating the monitoring point, verify!. ' + err,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async findAll() {
    try {
      const monitoringPoints = await this.monitoringPointRepository.getAll();

      const monitoringPointsWithDetails = await Promise.all(
        monitoringPoints.map(async (monitoringPoint) => {
          const machineOfMonitoringPoint =
            await this.machinesRepository.getById(monitoringPoint.machineId);
          const sensorOfMonitoringPoint = Sensor.getSensorById(
            monitoringPoint.sensorId,
          );

          return {
            id: monitoringPoint.id,
            name: monitoringPoint.name,
            machineName: machineOfMonitoringPoint.name,
            machineType: machineOfMonitoringPoint.type,
            sensorModel: sensorOfMonitoringPoint.modelName,
          };
        }),
      );
      return {
        status: 'Ok!',
        monitoringPoints: monitoringPointsWithDetails,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async getMonitoringPointById(@Param('id') id: number): Promise<{}> {
    try {
      const monitoringPoint = await this.monitoringPointRepository.getById(
        Number(id),
      );
      const machineOfMonitoringPoint = await this.machinesRepository.getById(
        monitoringPoint.machineId,
      );
      const sensorOfMonitoringPoint = Sensor.getSensorById(
        monitoringPoint.sensorId,
      );
      if (monitoringPoint == null) {
        throw new InternalServerErrorException('Monitoring point not found');
      } else {
        return {
          status: 'Ok!',
          monitoringPoint: {
            id: monitoringPoint.id,
            name: monitoringPoint.name,
            machine: machineOfMonitoringPoint,
            sensor: sensorOfMonitoringPoint,
          },
        };
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async update(@Body() monitoringPoint: MonitoringPoints) {
    try {
      const existingMonitoringPoint =
        await this.monitoringPointRepository.getById(monitoringPoint.id);
      if (!existingMonitoringPoint) {
        throw new InternalServerErrorException('Monitoring point not found');
      }

      const monitoringPointWithSameName =
        await this.monitoringPointRepository.getByMonitoringPoints(
          monitoringPoint,
        );
      if (
        monitoringPointWithSameName &&
        monitoringPointWithSameName.id !== monitoringPoint.id
      ) {
        throw new InternalServerErrorException(
          'Monitoring point name already exists. Choose another name.',
        );
      }

      await this.monitoringPointRepository.update(monitoringPoint);

      return {
        status: 'Ok!',
        message: 'Monitoring point updated successfully.',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Error updating the monitoring point, verify!. ' + err,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedRequest)
  async delete(@Param('id') id: number) {
    try {
      const monitoringPoint = await this.monitoringPointRepository.getById(
        Number(id),
      );
      if (!monitoringPoint) {
        throw new InternalServerErrorException('Monitoring point not found');
      }
      await this.monitoringPointRepository.delete(Number(id));
      return {
        status: 'Ok!',
        message: 'Monitoring point deleted successfully',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Error deleting the monitoring point, verify!. ' + err,
      );
    }
  }
}
export default MonitoringPointsController;
