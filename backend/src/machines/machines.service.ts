import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMachineDto } from './create-machine.dto';
import { AddMonitoringPointsDto } from './add-monitoring-points.dto';
import { UpdateMachineDto } from './update-machine-dto';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetches all machines from the database along with their monitoring points and sensors.
   * @returns {Promise<Machine[]>} A list of machines with their monitoring points and sensors.
   */
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

  /**
   * Creates a new machine in the database.
   * @param {CreateMachineDto} createMachineDto - The data required to create a new machine.
   * @returns {Promise<Machine>} The created machine.
   */
  async createMachine(createMachineDto: CreateMachineDto) {
    return this.prisma.machine.create({
      data: {
        name: createMachineDto.name,
        type: createMachineDto.type,
      },
    });
  }

  /**
   * Updates an existing machine in the database.
   * @param {string} machineId - The ID of the machine to update.
   * @returns {Promise<Machine>} The updated machine.
   */
  async updateMachine(machineId: string, updateMachineDto: UpdateMachineDto) {
    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const updatedMachine = await this.prisma.machine.update({
      where: { id: machineId },
      data: {
        name: updateMachineDto.name || machine.name,
        type: updateMachineDto.type || machine.type,
      },
    });

    return updatedMachine;
  }

  /**
   * Fetches all sensors from the database.
   * @returns {Promise<Sensor[]>} A list of sensors.
   */
  async getSensors() {
    return this.prisma.sensor.findMany();
  }

  /**
   * Adds a monitoring point to a specific machine.
   * @param {string} machineId - The ID of the machine to add the monitoring point to.
   * @param {AddMonitoringPointsDto} addMonitoringPointDto - The data for the monitoring point to add.
   * @returns {Promise<MonitoringPoint>} The newly added monitoring point.
   */
  async addMonitoringPoints(
    machineId: string,
    addMonitoringPointDto: AddMonitoringPointsDto,
  ) {
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

    if (!validSensorModels.includes(addMonitoringPointDto.sensorModel)) {
      throw new BadRequestException('Invalid sensor model');
    }

    if (
      machine.type === 'Pump' &&
      ['TcAg', 'TcAs'].includes(addMonitoringPointDto.sensorModel)
    ) {
      throw new BadRequestException(
        'TcAg and TcAs sensors are not allowed for Pump machines',
      );
    }

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

  /**
   * Deletes a machine from the database along with its associated monitoring points.
   * @param {string} machineId - The ID of the machine to delete.
   * @returns {Promise<{ message: string }>} A confirmation message indicating the machine and its
   * monitoring points have been deleted.
   */
  async deleteMachine(machineId: string) {
    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    await this.prisma.monitoringPoint.deleteMany({
      where: { machineId: machineId },
    });

    await this.prisma.machine.delete({
      where: { id: machineId },
    });

    return { message: 'Machine and its monitoring points have been deleted' };
  }

  /**
   * Deletes a specific monitoring point from a machine.
   * @param {string} machineId - The ID of the machine that the monitoring point belongs to.
   * @param {string} monitoringPointId - The ID of the monitoring point to delete.
   * @returns {Promise<{ message: string }>} A confirmation message indicating the monitoring point has been deleted.
   */
  async deleteMonitoringPoint(machineId: string, monitoringPointId: string) {
    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    // Check if the monitoring point exists
    const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
      where: { id: monitoringPointId },
    });

    if (!monitoringPoint) {
      throw new NotFoundException('Monitoring point not found');
    }

    if (monitoringPoint.machineId !== machineId) {
      throw new BadRequestException(
        'Monitoring point does not belong to this machine',
      );
    }

    await this.prisma.monitoringPoint.delete({
      where: { id: monitoringPointId },
    });

    return { message: 'Monitoring point has been deleted' };
  }
}
