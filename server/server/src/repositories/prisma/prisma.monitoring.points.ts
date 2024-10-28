import { PrismaService } from 'src/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MonitoringPoints } from '@prisma/client';
import { MonitoringPointsRepository } from '../MonitoringPointsRepository/monitoring.points.repository';
import Sensor from 'src/VOs/sensors.vo';
import { PrismaMachineRepository } from './prisma.machine.repository';
import isValidMonitoringPoint from 'src/utils/validation/validate.monitoring.points';

@Injectable()
export class PrismaMonitoringPointsRepository
  implements MonitoringPointsRepository
{
  constructor(
    private prisma: PrismaService,
    private machineRepository: PrismaMachineRepository,
  ) {}

  async create(monitoringPoint: Omit<MonitoringPoints, 'id'>): Promise<void> {
    try {
      let sensor = Sensor.getSensorById(Number(monitoringPoint.sensorId));
      let machine = this.machineRepository.getById(
        Number(monitoringPoint.machineId),
      );

      let isValidMachineType = await isValidMonitoringPoint(sensor, machine);

      if (!isValidMachineType) {
        throw new Error(
          `Error creating this monitoring point, the type ${sensor.modelName} is no available for this machine type`,
        );
      }

      await this.prisma.monitoringPoints.create({
        data: {
          name: monitoringPoint.name,
          machineId: monitoringPoint.machineId,
          sensorId: monitoringPoint.sensorId,
        },
      });
    } catch (err: any) {
      throw new Error(`Error creating the monitoring point: ${err.message}`);
    }
  }

  async getAll(): Promise<MonitoringPoints[]> {
    try {
      let allMonitoringPoints = await this.prisma.monitoringPoints.findMany();
      return allMonitoringPoints;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getById(id: number): Promise<MonitoringPoints | null> {
    try {
      let monitoringPoint = await this.prisma.monitoringPoints.findUnique({
        where: {
          id: id,
        },
      });
      if (monitoringPoint == null) {
        return;
      } else {
        return monitoringPoint;
      }
    } catch (err) {
      throw err;
    }
  }

  async getByMonitoringPoints(
    monitoringPoint: Omit<MonitoringPoints, 'id'>,
  ): Promise<MonitoringPoints | null> {
    try {
      let existingMonitoringPoint =
        await this.prisma.monitoringPoints.findUnique({
          where: {
            name: monitoringPoint.name,
          },
        });
      if (existingMonitoringPoint == null) {
        return;
      } else {
        return existingMonitoringPoint;
      }
    } catch (err) {
      throw err;
    }
  }

  async getByMachine(machineId: number): Promise<boolean> {
    try {
      let existingMonitoringPoint = await this.prisma.monitoringPoints.findMany(
        {
          where: {
            machineId: machineId,
          },
        },
      );
      if (existingMonitoringPoint.length != 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  async update(monitoringPoint: MonitoringPoints): Promise<void> {
    try {
      const existingMonitoringPoint =
        await this.prisma.monitoringPoints.findUnique({
          where: {
            id: monitoringPoint.id,
          },
        });
      if (!existingMonitoringPoint) {
        throw new Error('Monitoring point not found!');
      }
      let sensor = Sensor.getSensorById(Number(monitoringPoint.sensorId));
      let machine = this.machineRepository.getById(
        Number(monitoringPoint.machineId),
      );
      let isValidMachineType = await isValidMonitoringPoint(sensor, machine);

      if (!isValidMachineType) {
        throw new Error(
          `Error updating this monitoring point, the type ${sensor.modelName} is no available for this machine type`,
        );
      }

      await this.prisma.monitoringPoints.update({
        where: {
          id: existingMonitoringPoint.id,
        },
        data: {
          name:
            existingMonitoringPoint.name == undefined
              ? existingMonitoringPoint.name
              : monitoringPoint.name,
          sensorId:
            existingMonitoringPoint.sensorId == undefined
              ? existingMonitoringPoint.sensorId
              : monitoringPoint.sensorId,
          machineId:
            existingMonitoringPoint.machineId == undefined
              ? existingMonitoringPoint.machineId
              : monitoringPoint.machineId,
        },
      });
    } catch (err: any) {
      throw new Error(`Error updating the monitoring point ${err.message}`);
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this.prisma.monitoringPoints.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw err.message;
    }
  }
}
