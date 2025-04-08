import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sensor } from '@prisma/client';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSensorDto): Promise<Sensor> {
    const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
      where: { id: data.monitoringPointId },
      include: {
        machine: true,
      },
    });

    if (!monitoringPoint) {
      throw new BadRequestException('Ponto de monitoramento não encontrado');
    }

    const machine = monitoringPoint.machine;

    if (!machine) {
      throw new BadRequestException(
        'Máquina associada ao ponto não encontrada',
      );
    }

    if (
      machine.type === 'Pump' &&
      (data.model === 'TcAg' || data.model === 'TcAs')
    ) {
      throw new BadRequestException(
        'Sensores TcAg e TcAs não podem ser associados a Bombas!',
      );
    }

    return this.prisma.sensor.create({
      data: {
        model: data.model,
        monitoringPointId: data.monitoringPointId,
      },
    });
  }

  async findAll(): Promise<Sensor[]> {
    return this.prisma.sensor.findMany({
      include: {
        monitoringPoint: {
          include: {
            machine: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Sensor> {
    const sensor = await this.prisma.sensor.findUnique({ where: { id } });

    if (!sensor) {
      throw new NotFoundException(`Sensor com ID ${id} não encontrado`);
    }

    return await this.prisma.sensor.delete({ where: { id } });
  }
}
