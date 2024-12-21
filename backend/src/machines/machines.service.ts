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
    // Validate that the sensors are correct (if monitoring points are provided)
    if (createMachineDto.monitoringPoints) {
      const validSensorModels = ['TcAg', 'TcAs', 'HF+'];

      if (createMachineDto.type === 'Pump') {
        // Validate each monitoring point's sensor
        for (const point of createMachineDto.monitoringPoints) {
          const sensor = await this.prisma.sensor.findUnique({
            where: { id: point.sensorId },
          });

          // If the sensor doesn't exist or has an invalid model
          if (!sensor) {
            throw new Error(`Sensor with ID ${point.sensorId} does not exist.`);
          }

          // If the sensor model is invalid for Pump machines
          if (['TcAg', 'TcAs'].includes(sensor.name)) {
            throw new Error(
              `Sensors TcAg and TcAs cannot be used with Pump machines.`,
            );
          }

          // Check if the sensor model is not valid
          if (!validSensorModels.includes(sensor.name)) {
            throw new Error(
              `Invalid sensor model: ${sensor.name}. Allowed models are: TcAg, TcAs, HF+.`,
            );
          }
        }
      }
    }

    // Create the machine (without monitoring points if they are not provided)
    return this.prisma.machine.create({
      data: {
        name: createMachineDto.name,
        type: createMachineDto.type,
        monitoringPoints: createMachineDto.monitoringPoints
          ? {
              create: createMachineDto.monitoringPoints.map((point) => ({
                name: point.name,
                sensor: { connect: { id: point.sensorId } },
              })),
            }
          : undefined,
      },
      include: {
        monitoringPoints: {
          include: {
            sensor: true,
          },
        },
      },
    });
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
}
