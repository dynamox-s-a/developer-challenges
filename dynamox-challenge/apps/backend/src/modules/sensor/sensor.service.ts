import { ConflictException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateSensorDto } from "./dto/update-sensor.dto";
import { CreateSensorDto, SensorModel } from "./dto/create-sensor.dto";


@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) { }

  async create(createSensorDto: CreateSensorDto) {
    const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
      where: {
        id: createSensorDto.monitoringPointId,
      },
      include: {
        machine: true,
      },
    });

    if (!monitoringPoint) {
      throw new NotFoundException(`Monitoring Point with Id ${createSensorDto.monitoringPointId} not found`);
    }


    if (monitoringPoint.machine.type === 'Bomba' &&
      (createSensorDto.model === SensorModel.TcAg || createSensorDto.model === SensorModel.TcAs)) {
      throw new BadRequestException('TcAg and TcAs sensors cannot be configured for Bomba machines');
    }

    const sensor = await this.prisma.sensor.findFirst({
      where: {
        model: createSensorDto.model,
        monitoringPointId: createSensorDto.monitoringPointId,
      }
    });

    if (sensor) {
      throw new ConflictException('This monitoring point already has a sensor of this type');
    }

    return this.prisma.sensor.create({
      data: createSensorDto,
    });
  }

  findAll(monitoringPointId?: number) {
    const where: any = {};

    if (monitoringPointId) {
      where.monitoringPointId = monitoringPointId;
    }

    return this.prisma.sensor.findMany({
      where,
      include: {
        monitoringPoint: {
          include: {
            machine: true,
          },
        },
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  findOne(id: number) {
    return this.prisma.sensor.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSensorDto: UpdateSensorDto) {
    const sensor = await this.prisma.sensor.findUnique({
      where: { id },
    });

    if (!sensor) {
      throw new NotFoundException(`Sensor with Id ${id} not found`);
    }

    if (updateSensorDto.model) {
      const targetMonitoringPointId = updateSensorDto.monitoringPointId || sensor.monitoringPointId;

      const sensorWithSameName = await this.prisma.sensor.findFirst({
        where: {
          model: updateSensorDto.model,
          monitoringPointId: targetMonitoringPointId,
          NOT: {
            id,
          },
        },
      });

      if (sensorWithSameName) {
        throw new ConflictException('Sensor with this name already exists for this monitoring point');
      }
    }

    return this.prisma.sensor.update({
      where: { id },
      data: updateSensorDto,
    });
  }

  async remove(id: number) {
    const sensor = await this.prisma.sensor.findUnique({
      where: { id },
    });

    if (!sensor) {
      throw new NotFoundException(`Sensor with Id ${id} not found`);
    }

    return this.prisma.sensor.delete({
      where: { id },
    });
  }
}