import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MachineType, MonitoringPoint, Sensor } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { ALLOWED_SENSORS } from '../sensor/sensor.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

type MonitoringPointWithSensor = {
  sensor?: Sensor;
} & MonitoringPoint;

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  async create(createMachineDto: CreateMachineDto, userId: number) {
    return await this.prisma.machine.create({
      data: {
        ...createMachineDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    const machines = await this.prisma.machine.findMany({
      where: { userId },
    });

    return machines;
  }

  async findOne(machineId: number, userId: number) {
    try {
      const machine = await this.prisma.machine.findUniqueOrThrow({
        where: {
          id: machineId,
          userId,
        },
      });
      return machine;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
    }
  }

  async update(
    machineId: number,
    userId: number,
    updateMachineDto: UpdateMachineDto
  ) {
    try {
      const machine = await this.prisma.machine.findUniqueOrThrow({
        where: {
          userId,
          id: machineId,
        },
        include: {
          monitoringPoints: {
            include: {
              sensor: true,
            },
          },
        },
      });

      const isMachineTypeChanging =
        Boolean(updateMachineDto.type) &&
        updateMachineDto.type !== machine.type;

      if (isMachineTypeChanging) {
        const { monitoringPoints } = machine;
        const futureType = updateMachineDto.type;
        this.checkSensorsCompatibility(monitoringPoints, futureType);
      }

      return await this.prisma.machine.update({
        data: updateMachineDto,
        where: {
          id: machineId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async remove(machineId: number, userId: number) {
    try {
      return await this.prisma.machine.delete({
        where: {
          id: machineId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  private checkSensorsCompatibility(
    monitoringPoints: MonitoringPointWithSensor[],
    futureMachineType: MachineType
  ) {
    const incompatibleSensor = monitoringPoints.find((mp) => {
      const sensor = mp.sensor?.model;
      const isChangeAllowed =
        ALLOWED_SENSORS[futureMachineType].includes(sensor);
      return sensor && !isChangeAllowed;
    });

    if (incompatibleSensor) {
      throw new ConflictException(
        'This machine currently has sensors associated with that do not support new type. Please delete them first before updating.'
      );
    }
  }
}
