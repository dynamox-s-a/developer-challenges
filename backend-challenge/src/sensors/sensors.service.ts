import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async create(createSensorDto: CreateSensorDto, req: any, machineId: string, pointId: string) {
    const sensorId = randomUUID()

    const machine = await this.prisma.machine.findUnique({
      where: { idMachine: machineId },
    });
    if (!machine) throw new NotFoundException('Machine not found');

    const point = await this.prisma.monitoringPoint.findUnique({
      where: { idPoint_machineId: {idPoint: pointId, machineId: machineId} },
    });
    if (!point) throw new NotFoundException('Monitoring point not found');

    // Regra negócio: Sensores TcAg e TcAs não podem ser usados com máquinas do tipo Bomba
    if(machine.type === 'Pump' && (createSensorDto.model === 'TcAg' || createSensorDto.model === 'TcAs')) {
      throw new BadRequestException('Sensor type not allowed for this machine');
    }

    return this.prisma.sensor.create({
      data: {
        idSensor: sensorId,
        ...createSensorDto,
        userId: req.sub.sub,
        pointId,
        machineId
      }
    })
  }

  async findAll() {
    return await this.prisma.sensor.findMany();
  }

  async getSensorDetails() {
    return await this.prisma.sensor.findMany({
      select: {
        model: true, // Sensor Model
        monitoringPoint: {
          select: {
            name: true, // Monitoring Point Name
            machine: {
              select: {
                name: true, // Machine Name
                type: true // Machine Type
              }
            }
          },
        },
      },
    })
  }

  async findOne(id: string) {
    return await this.prisma.sensor.findUnique({where: {idSensor: id}});
  }

  async update(id: string, updateSensorDto: UpdateSensorDto) {
    return this.prisma.sensor.update({where: {idSensor: id}, data: updateSensorDto});
  }

  async remove(id: string) {
    return await this.prisma.sensor.delete({where: {idSensor: id}});
  }
}
