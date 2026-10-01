import { Injectable } from '@nestjs/common';
import type { Location, MachineType, SensorModel } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Where a serial number is installed, to tell the user why it cannot go elsewhere. */
export interface SensorPlacement {
  monitoringPointId: string;
  pointName: string;
  ownerId: string;
  sectorCode: string;
  machineType: MachineType;
  machineNumber: number;
}

/** An installed sensor with what identifies its place. */
export interface InstalledRow {
  serialNumber: string;
  model: SensorModel;
  monitoringPoint: {
    id: string;
    location: Location;
    machine: { type: MachineType; number: number; sector: { code: string } };
  };
}

/** The only place that queries the sensors table (ADR 0002). */
@Injectable()
export class SensorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySerial(serialNumber: string): Promise<SensorPlacement | null> {
    const sensor = await this.prisma.sensor.findUnique({
      where: { serialNumber },
      select: {
        monitoringPoint: {
          select: {
            id: true,
            name: true,
            machine: {
              select: {
                type: true,
                number: true,
                sector: { select: { code: true, ownerId: true } },
              },
            },
          },
        },
      },
    });
    if (!sensor) return null;
    const { monitoringPoint: point } = sensor;
    return {
      monitoringPointId: point.id,
      pointName: point.name,
      ownerId: point.machine.sector.ownerId,
      sectorCode: point.machine.sector.code,
      machineType: point.machine.type,
      machineNumber: point.machine.number,
    };
  }

  /**
   * The sensors installed at points of the user, by serial number, optionally limited to
   * the given serial numbers.
   */
  listInstalled(ownerId: string, serialNumbers?: string[]): Promise<InstalledRow[]> {
    return this.prisma.sensor.findMany({
      where: {
        monitoringPoint: { machine: { sector: { ownerId } } },
        ...(serialNumbers ? { serialNumber: { in: serialNumbers } } : {}),
      },
      orderBy: { serialNumber: 'asc' },
      select: {
        serialNumber: true,
        model: true,
        monitoringPoint: {
          select: {
            id: true,
            location: true,
            machine: { select: { type: true, number: true, sector: { select: { code: true } } } },
          },
        },
      },
    });
  }

  /** Installs the sensor, or replaces the one already at the point (B14). */
  async install(
    monitoringPointId: string,
    machineType: MachineType,
    serialNumber: string,
    model: SensorModel,
  ): Promise<void> {
    await this.prisma.sensor.upsert({
      where: { monitoringPointId },
      create: { monitoringPointId, machineType, serialNumber, model },
      update: { serialNumber, model },
    });
  }

  /** Removes the sensor of a point; answers whether there was one. */
  async remove(monitoringPointId: string): Promise<boolean> {
    const { count } = await this.prisma.sensor.deleteMany({ where: { monitoringPointId } });
    return count === 1;
  }
}
