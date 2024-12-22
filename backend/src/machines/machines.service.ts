import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMachineDto } from './create-machine.dto';
import { AddMonitoringPointsDto } from './add-monitoring-points.dto';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  // Fetch all machines from the database
  async getMachines() {
    return this.prisma.machine.findMany({
      include: {
        monitoringPoints: {
          include: {
            sensor: true,
          },
        },
      },
    });
  }

  async createMachine(createMachineDto: CreateMachineDto) {
    return this.prisma.machine.create({
      data: {
        name: createMachineDto.name,
        type: createMachineDto.type,
      },
    });
  }

  async getSensors() {
    return this.prisma.sensor.findMany();
  }

  async addMonitoringPoints(
    machineId: string,
    addMonitoringPointDto: AddMonitoringPointsDto,
  ) {
    // Check if the machine exists
    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const sensor = await this.prisma.sensor.findUnique({
      where: { id: addMonitoringPointDto.sensorId },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    const validSensorModels = ['TcAg', 'TcAs', 'HF+'];

    // If the sensor model is invalid, throw an error
    if (!validSensorModels.includes(addMonitoringPointDto.sensorModel)) {
      throw new BadRequestException('Invalid sensor model');
    }

    // If the machine type is 'Pump', TcAg and TcAs sensors are not allowed
    if (
      machine.type === 'Pump' &&
      ['TcAg', 'TcAs'].includes(addMonitoringPointDto.sensorModel)
    ) {
      throw new BadRequestException(
        'TcAg and TcAs sensors are not allowed for Pump machines',
      );
    }

    // Create the monitoring point and associate it with the machine and sensor
    const monitoringPoint = await this.prisma.monitoringPoint.create({
      data: {
        name: addMonitoringPointDto.name,
        sensor: {
          connect: { id: addMonitoringPointDto.sensorId },
        },
        machine: {
          connect: { id: machineId },
        },
      },
    });

    return monitoringPoint;
  }

  // delete machine
  // delete monnitoring points
}
