import { ConflictException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateMonitotingPointDto } from "./dto/update-monitoring-point.dto";
import { CreateMonitoringPointDto } from "./dto/create-monitoring-point.dto";
import { SensorModel } from "../sensor/dto/create-sensor.dto";


@Injectable()
export class MonitoringPointService {
  constructor(private prisma: PrismaService) { }

  async create(createMonitoringPointDto: CreateMonitoringPointDto) {
    if (!createMonitoringPointDto.name || createMonitoringPointDto.name.trim().length === 0) {
      throw new BadRequestException('Monitoring point name cannot be empty or consist only of whitespace');
    }

    const machine = await this.prisma.machine.findUnique({
      where: {
        id: createMonitoringPointDto.machineId,
      }
    });

    if (!machine) {
      throw new NotFoundException(`Machine with Id ${createMonitoringPointDto.machineId} not found`);
    }

    if (createMonitoringPointDto.sensorModel &&
      machine.type === 'Bomba' &&
      (createMonitoringPointDto.sensorModel === SensorModel.TcAg ||
        createMonitoringPointDto.sensorModel === SensorModel.TcAs)) {
      throw new BadRequestException('TcAg and TcAs sensors cannot be configured for Pump machines');
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

    // Create monitoring point and sensor together
    const { sensorModel, ...monitoringPointData } = createMonitoringPointDto;

    const created = await this.prisma.monitoringPoint.create({
      data: monitoringPointData,
      include: {
        sensors: true,
      }
    });

    // Create sensor if provided
    if (sensorModel) {
      await this.prisma.sensor.create({
        data: {
          model: sensorModel,
          monitoringPointId: created.id,
        }
      });
    }

    // Return with sensors included
    return this.prisma.monitoringPoint.findUnique({
      where: { id: created.id },
      include: {
        sensors: true,
      }
    });
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 5;
    const skip = (page - 1) * limit;
    const sortBy = params?.sortBy || 'id';
    const sortOrder = params?.sortOrder || 'asc';


    let orderBy: any = {};

    if (sortBy === 'machineName') {
      orderBy = { machine: { name: sortOrder } };
    } else if (sortBy === 'machineType') {
      orderBy = { machine: { type: sortOrder } };
    } else if (sortBy === 'monitoringPointName') {
      orderBy = { name: sortOrder };
    } else if (sortBy === 'sensorModel') {
      orderBy = { sensors: { _count: sortOrder } };
    } else {
      orderBy = { id: sortOrder };
    }

    const [data, total] = await Promise.all([
      this.prisma.monitoringPoint.findMany({
        skip,
        take: limit,
        orderBy,
        include: {
          machine: true,
          sensors: true,
          _count: {
            select: { sensors: true }
          }
        }
      }),
      this.prisma.monitoringPoint.count()
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.prisma.monitoringPoint.findUnique({
      where: { id },
      include: {
        sensors: true,
      }
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