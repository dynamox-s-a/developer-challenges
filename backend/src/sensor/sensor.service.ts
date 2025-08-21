import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSensorDto } from './dto';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSensorDto) {
    const point = await this.prisma.monitoringPoint.findUnique({
      where: { id: dto.monitoringPointId },
      include: { machine: true },
    });

    if (!point) throw new NotFoundException('Monitoring point not found');

    const { type } = point.machine;

    if (type === 'Pump' && ['TcAg', 'TcAs'].includes(dto.model)) {
      throw new BadRequestException(
        'Sensor model not allowed for Pump machines',
      );
    }

    return this.prisma.sensor.create({
      data: {
        model: dto.model,
        monitoringPointId: dto.monitoringPointId,
      },
    });
  }

  async findAll() {
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
}
