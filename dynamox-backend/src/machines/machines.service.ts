import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Machine, Prisma } from '@prisma/client';
import { AssignSensorDto } from '../sensors/dto/assign-sensor.dto';
import { SensorsService } from '../sensors/sensors.service';

@Injectable()
export class MachinesService {
  constructor(
    private prisma: PrismaService,
    private sensorsService: SensorsService,
  ) {}

  private isValidMachineType(
    machineType: 'Pump' | 'Fan',
    sensorModel: string,
  ): boolean {
    const invalidCombinations: Record<string, string[]> = {
      Pump: ['TcAg', 'TcAs'],
      Fan: [],
    };
    return !invalidCombinations[machineType]?.includes(sensorModel);
  }

  async assignSensor(data: AssignSensorDto & { machineId: string }) {
    const machine = await this.prisma.machine.findUnique({
      where: { id: data.machineId },
    });

    if (!machine) {
      throw new NotFoundException('Máquina não encontrada');
    }

    if (machine.type === 'Pump' && ['TcAg', 'TcAs'].includes(data.model)) {
      throw new BadRequestException(
        `Sensores do tipo ${data.model} não podem ser associados a bombas`,
      );
    }

    if (!this.isValidMachineType(machine.type as 'Pump' | 'Fan', data.model)) {
      throw new BadRequestException(
        `Sensor ${data.model} não pode ser associado a máquinas do tipo ${machine.type}`,
      );
    }

    return this.sensorsService.create({
      model: data.model as 'TcAg' | 'TcAs' | 'HF_Plus',
      monitoringPointId: data.monitoringPointId,
    });
  }

  async create(data: Prisma.MachineCreateInput): Promise<Machine> {
    return this.prisma.machine.create({ data });
  }

  async findAll(): Promise<Machine[]> {
    return this.prisma.machine.findMany();
  }

  async findOne(id: string): Promise<Machine | null> {
    return this.prisma.machine.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.MachineUpdateInput): Promise<Machine> {
    return this.prisma.machine.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Machine> {
    return this.prisma.machine.delete({ where: { id } });
  }
}
