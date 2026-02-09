import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, MachineType, SensorModel } from '@source/persistence';

interface SensorData {
  model: SensorModel;
}

interface MonitoringPointData {
  id?: number;
  name: string;
  sensor?: SensorData;
}

interface MachineData {
  name: string;
  type: MachineType;
  monitoringPoints: MonitoringPointData[];
}

@Injectable()
export class MachinesService {
  private validateMachineData(data: Partial<MachineData>) {
    if (data.monitoringPoints && data.monitoringPoints.length < 2) {
      throw new BadRequestException('A machine must have at least 2 monitoring points');
    }

    if (data.type === MachineType.Pump && data.monitoringPoints) {
      const hasInvalidSensor = data.monitoringPoints.some(
        (mp) => mp.sensor && (mp.sensor.model === SensorModel.TcAg || mp.sensor.model === SensorModel.TcAs),
      );
      if (hasInvalidSensor) {
        throw new BadRequestException('Pump machines cannot use TcAg or TcAs sensors');
      }
    }
  }

  async findAll() {
    return prisma.machine.findMany({
      include: { monitoringPoints: { include: { sensor: true } } },
    });
  }

  async findOne(id: number) {
    const machine = await prisma.machine.findUnique({
      where: { id },
      include: { monitoringPoints: { include: { sensor: true } } },
    });
    if (!machine) throw new NotFoundException(`Machine with ID ${id} not found`);
    return machine;
  }

  async create(data: MachineData) {
    this.validateMachineData(data);

    return prisma.machine.create({
      data: {
        name: data.name,
        type: data.type,
        monitoringPoints: {
          create: data.monitoringPoints.map((mp) => ({
            name: mp.name,
            sensor: mp.sensor
              ? {
                  create: {
                    model: mp.sensor.model,
                  },
                }
              : undefined,
          })),
        },
      },
      include: { monitoringPoints: { include: { sensor: true } } },
    });
  }

  async update(id: number, data: Partial<MachineData>) {
    this.validateMachineData(data);

    return prisma.$transaction(async (tx) => {
      const existingMachine = await tx.machine.findUnique({
        where: { id },
        include: { monitoringPoints: { include: { sensor: true } } },
      });

      if (!existingMachine) throw new NotFoundException(`Machine with ID ${id} not found`);

      // Update machine basic info
      await tx.machine.update({
        where: { id },
        data: {
          name: data.name,
          type: data.type,
        },
      });

      if (data.monitoringPoints) {
        const incomingIds = data.monitoringPoints.map((mp) => mp.id).filter(Boolean) as number[];
        const existingIds = existingMachine.monitoringPoints.map((mp) => mp.id);

        // 1. Delete monitoring points that are not in the incoming list
        const idsToDelete = existingIds.filter((extId) => !incomingIds.includes(extId));
        if (idsToDelete.length > 0) {
          // Cascading delete for telemetry, sensors, and monitoring points
          const sensorsToDelete = await tx.sensor.findMany({
            where: { monitoringPointId: { in: idsToDelete } },
            select: { id: true },
          });
          const sensorIds = sensorsToDelete.map((s) => s.id);

          await tx.telemetry.deleteMany({ where: { sensorId: { in: sensorIds } } });
          await tx.sensor.deleteMany({ where: { monitoringPointId: { in: idsToDelete } } });
          await tx.monitoringPoint.deleteMany({ where: { id: { in: idsToDelete } } });
        }

        // 2. Update existing or Create new monitoring points
        for (const mp of data.monitoringPoints) {
          if (mp.id) {
            // Update
            await tx.monitoringPoint.update({
              where: { id: mp.id },
              data: {
                name: mp.name,
                sensor: mp.sensor
                  ? {
                      upsert: {
                        create: { model: mp.sensor.model },
                        update: { model: mp.sensor.model },
                      },
                    }
                  : {
                      delete: true, // If sensor was removed
                    },
              },
            });
          } else {
            // Create
            await tx.monitoringPoint.create({
              data: {
                name: mp.name,
                machineId: id,
                sensor: mp.sensor
                  ? {
                      create: { model: mp.sensor.model },
                    }
                  : undefined,
              },
            });
          }
        }
      }

      return tx.machine.findUnique({
        where: { id },
        include: { monitoringPoints: { include: { sensor: true } } },
      });
    });
  }

  async remove(id: number) {
    return prisma.$transaction(async (tx) => {
      const monitoringPoints = await tx.monitoringPoint.findMany({
        where: { machineId: id },
        select: { id: true },
      });

      const mpIds = monitoringPoints.map((mp) => mp.id);

      const sensors = await tx.sensor.findMany({
        where: { monitoringPointId: { in: mpIds } },
        select: { id: true },
      });

      const sensorIds = sensors.map((s) => s.id);

      await tx.telemetry.deleteMany({ where: { sensorId: { in: sensorIds } } });
      await tx.sensor.deleteMany({ where: { monitoringPointId: { in: mpIds } } });
      await tx.monitoringPoint.deleteMany({ where: { machineId: id } });
      return tx.machine.delete({ where: { id } });
    });
  }
}
