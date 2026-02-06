import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateMonitotingPointDto } from "./dto/update-monitoring-point.dto";
import { CreateMonitoringPointDto } from "./dto/create-monitoring-point.dto";


@Injectable()
export class MonitoringPointService {
  constructor(private prisma: PrismaService) { }

  async create(createMonitoringPointDto: CreateMonitoringPointDto) {
    const machine = await this.prisma.machine.findUnique({
      where: {
        id: createMonitoringPointDto.machineId,
      }
    });

    if (!machine) {
      throw new NotFoundException(`Machine with Id ${createMonitoringPointDto.machineId} not found`);
    }

    const monitoringPoint = await this.prisma.monitoringPoint.findFirst({
      where: {
        name: createMonitoringPointDto.name,
        machineId: createMonitoringPointDto.machineId,
      }
    });

    if (monitoringPoint) {
      throw new ConflictException('Monitoring Point with this name already exists for this machine');
    }

    return this.prisma.monitoringPoint.create({
      data: createMonitoringPointDto,
    });
  }

  findAll() {
    return this.prisma.monitoringPoint.findMany({
      include: {
        machine: true,
        _count: {
          select: { sensors: true }
        }
      }
    });
  }

  findOne(id: number) {
    return this.prisma.monitoringPoint.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMonitoringPointDto: UpdateMonitotingPointDto) {
    const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
      where: { id },
    });

    if (!monitoringPoint) {
      throw new NotFoundException(`Monitoring Point with Id ${id} not found`);
    }

    if (updateMonitoringPointDto.name) {
      const targetMachineId = updateMonitoringPointDto.machineId || monitoringPoint.machineId;

      const monitoringPointWithSameName = await this.prisma.monitoringPoint.findFirst({
        where: {
          name: updateMonitoringPointDto.name,
          machineId: targetMachineId,
          NOT: {
            id,
          },
        },
      });

      if (monitoringPointWithSameName) {
        throw new ConflictException('Monitoring Point with this name already exists for this machine');
      }
    }

    return this.prisma.monitoringPoint.update({
      where: { id },
      data: updateMonitoringPointDto,
    });
  }

  async remove(id: number) {
    const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
      where: { id },
    });

    if (!monitoringPoint) {
      throw new NotFoundException(`Monitoring Point with Id ${id} not found`);
    }

    const sensorsCount = await this.prisma.sensor.count({
      where: {
        monitoringPointId: id
      }
    });

    if (sensorsCount > 0) {
      throw new ConflictException('Cannot delete Monitoring Point with associated Sensors');
    }

    return this.prisma.monitoringPoint.delete({
      where: { id },
    });
  }
}