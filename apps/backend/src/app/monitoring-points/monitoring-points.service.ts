import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaError } from '@dynamox-challenge/prisma';
import { PrismaService } from '../database/PrismaService';
import {
  CreateMonitoringPointDto,
  createMonitoringPointDto,
  UpdateMonitoringPointDto,
  updateMonitoringPointDto,
} from '@dynamox-challenge/dto';

@Injectable()
export class MonitoringPointsService {
  constructor(private prisma: PrismaService) {}
  async create(body: CreateMonitoringPointDto): Promise<{
    statusCode: number;
    data: string | { id: number; name: string; machineId: number; sensorId: number };
  }> {
    const validation = createMonitoringPointDto.safeParse(body);
    if (!validation.success) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        data: validation
          .error
          .issues
          .map(issue => `Invalid value for attribute '${issue.path[0]}' - Message: ${issue.message}`).join('\n')
      };
    }

    const data = validation.data;

    try {
      const checkIfSensorExists = await this.prisma.sensor.findUnique({
        where: {
          id: data.sensorId,
        },
      });

      if (!checkIfSensorExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: 'Sensor not found',
        };
      }

      const checkIfMachineExists = await this.prisma.machine.findUnique({
        where: {
          id: data.machineId,
        },
      });

      if (!checkIfMachineExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: 'Machine not found',
        };
      }

      const checkIfSensorHaveBeenAssignedToMonitoringPoint = await this.prisma.monitoringPoint.findFirst({
        where: {
          sensorId: data.sensorId,
        },
      });

      if (checkIfSensorHaveBeenAssignedToMonitoringPoint) {
        return {
          statusCode: HttpStatus.CONFLICT,
          data: 'Sensor already assigned to a monitoring point',
        };
      }

      const checkIfMonitoringPointExists = await this.prisma.monitoringPoint.findFirst({
        where: {
          machineId: data.machineId,
          sensorId: data.sensorId,
        },
      });

      if (checkIfMonitoringPointExists) {
        return {
          statusCode: HttpStatus.CONFLICT,
          data: 'Monitoring Point already exists',
        };
      }

      const monitoringPoint = await this.prisma.monitoringPoint.create({
        data: {
          ...data,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: monitoringPoint,
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async findAll(): Promise<{
    statusCode: number;
    data: string | Array<{ id: number; name: string; machineId: number; sensorId: number }>;
  }> {
    try {
      const monitoringPoints = await this.prisma.monitoringPoint.findMany();
      return {
        statusCode: HttpStatus.OK,
        data: monitoringPoints,
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async findOne(id: number): Promise<{
    statusCode: number;
    data: string | { id: number; name: string; machineId: number; sensorId: number };
  }> {
    try {
      const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
        where: {
          id,
        },
      });
      if (!monitoringPoint) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: 'Monitoring Point not found',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        data: monitoringPoint,
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async update(id: number, body: UpdateMonitoringPointDto): Promise<{
    statusCode: number;
    data: string | { id: number; name: string; machineId: number; sensorId: number };
  }> {
    const validation = updateMonitoringPointDto.safeParse(body);
    if (!validation.success) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        data: validation
          .error
          .issues
          .map(issue => `Invalid value for attribute '${issue.path[0]}' - Message: ${issue.message}`).join('\n')
      };
    }

    const data = validation.data;

    try {
      const checkIfSensorExists = await this.prisma.sensor.findUnique({
        where: {
          id: data.sensorId,
        },
      });

      if (!checkIfSensorExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: 'Sensor not found',
        };
      }

      const checkIfMachineExists = await this.prisma.machine.findUnique({
        where: {
          id: data.machineId,
        },
      });

      if (!checkIfMachineExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: 'Machine not found',
        };
      }

      const checkIfSensorHaveBeenAssignedToMonitoringPoint = await this.prisma.monitoringPoint.findFirst({
        where: {
          sensorId: data.sensorId,
        },
      });

      if (checkIfSensorHaveBeenAssignedToMonitoringPoint) {
        return {
          statusCode: HttpStatus.CONFLICT,
          data: 'Sensor already assigned to a monitoring point',
        };
      }

      const checkIfMonitoringPointExists = await this.prisma.monitoringPoint.findFirst({
        where: {
          machineId: data.machineId,
          sensorId: data.sensorId,
        },
      });

      if (checkIfMonitoringPointExists) {
        return {
          statusCode: HttpStatus.CONFLICT,
          data: 'Monitoring Point already exists',
        };
      }

      const monitoringPoint = await this.prisma.monitoringPoint.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: monitoringPoint,
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async remove(id: number): Promise<{
    statusCode: number;
    data: string;
  }> {
    try {
      await this.prisma.monitoringPoint.delete({
        where: {
          id,
        },
      });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        data: 'Monitoring Point removed',
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }
}
