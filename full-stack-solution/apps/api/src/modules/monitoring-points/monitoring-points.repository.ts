import type {
  AssignSensorInput,
  ListMonitoringPointsQuery,
  MachineType,
  MonitoringPoint,
  MonitoringPointSortField,
  Paginated,
  Sensor,
  SortOrder,
} from "@full-stack-solution/shared";
import type {
  PrismaClient,
  SensorModel as DbSensorModel,
} from "../../generated/prisma/client";
import { isUniqueViolation } from "../../shared/database/prisma-errors";
import {
  toDatabaseSensorModel,
  toDomainSensorModel,
} from "../../shared/database/sensor-model.mapper";
import { ConflictError } from "../../shared/errors/app-error";

export interface MonitoringPointRef {
  id: string;
  machineType: MachineType;
}

export interface MonitoringPointsRepository {
  machineBelongsToUser(machineId: string, userId: string): Promise<boolean>;
  create(
    userId: string,
    machineId: string,
    name: string,
  ): Promise<MonitoringPoint>;
  findOwned(id: string, userId: string): Promise<MonitoringPointRef | null>;
  rename(id: string, name: string): Promise<MonitoringPoint>;
  delete(id: string, userId: string): Promise<boolean>;
  list(
    userId: string,
    query: ListMonitoringPointsQuery,
  ): Promise<Paginated<MonitoringPoint>>;
  replaceSensor(
    pointId: string,
    userId: string,
    input: AssignSensorInput,
  ): Promise<Sensor>;
  deleteSensor(pointId: string): Promise<boolean>;
}

const pointSelect = {
  id: true,
  name: true,
  machine: { select: { id: true, name: true, type: true } },
  sensor: { select: { id: true, model: true } },
} as const;

interface PointRow {
  id: string;
  name: string;
  machine: { id: string; name: string; type: MachineType };
  sensor: { id: string; model: DbSensorModel } | null;
}

function toMonitoringPoint(row: PointRow): MonitoringPoint {
  return {
    id: row.id,
    name: row.name,
    machineId: row.machine.id,
    machineName: row.machine.name,
    machineType: row.machine.type,
    sensorId: row.sensor?.id ?? null,
    // The only place a database sensor model becomes a domain one on reads.
    sensorModel: row.sensor ? toDomainSensorModel(row.sensor.model) : null,
  };
}

function buildOrderBy(sortBy: MonitoringPointSortField, order: SortOrder) {
  const primary = {
    machineName: { machine: { name: order } },
    machineType: { machine: { type: order } },
    name: { name: order },
    sensorModel: { sensor: { model: order } },
  }[sortBy];

  return [primary, { id: "asc" as const }];
}

export class PrismaMonitoringPointsRepository implements MonitoringPointsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async machineBelongsToUser(
    machineId: string,
    userId: string,
  ): Promise<boolean> {
    const machine = await this.prisma.machine.findFirst({
      where: { id: machineId, createdById: userId },
      select: { id: true },
    });
    return machine !== null;
  }

  async create(
    userId: string,
    machineId: string,
    name: string,
  ): Promise<MonitoringPoint> {
    const row = await this.prisma.monitoringPoint.create({
      data: { name, machineId, createdById: userId },
      select: pointSelect,
    });
    return toMonitoringPoint(row);
  }

  async findOwned(
    id: string,
    userId: string,
  ): Promise<MonitoringPointRef | null> {
    const row = await this.prisma.monitoringPoint.findFirst({
      where: { id, createdById: userId },
      select: { id: true, machine: { select: { type: true } } },
    });
    return row ? { id: row.id, machineType: row.machine.type } : null;
  }

  async rename(id: string, name: string): Promise<MonitoringPoint> {
    const row = await this.prisma.monitoringPoint.update({
      where: { id },
      data: { name },
      select: pointSelect,
    });
    return toMonitoringPoint(row);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { count } = await this.prisma.monitoringPoint.deleteMany({
      where: { id, createdById: userId },
    });
    return count > 0;
  }

  async list(
    userId: string,
    { page, pageSize, sortBy, order }: ListMonitoringPointsQuery,
  ): Promise<Paginated<MonitoringPoint>> {
    const where = { createdById: userId };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.monitoringPoint.findMany({
        where,
        select: pointSelect,
        orderBy: buildOrderBy(sortBy, order),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.monitoringPoint.count({ where }),
    ]);

    return { data: rows.map(toMonitoringPoint), page, pageSize, total };
  }

  async replaceSensor(
    pointId: string,
    userId: string,
    input: AssignSensorInput,
  ): Promise<Sensor> {
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        // deleteMany does not fail when the point has no sensor yet.
        await tx.sensor.deleteMany({ where: { monitoringPointId: pointId } });
        return tx.sensor.create({
          data: {
            id: input.id,
            model: toDatabaseSensorModel(input.model),
            monitoringPointId: pointId,
            createdById: userId,
          },
        });
      });

      return {
        id: row.id,
        model: toDomainSensorModel(row.model),
        monitoringPointId: row.monitoringPointId,
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictError(
          `Sensor ID "${input.id}" is already installed on another monitoring point`,
        );
      }
      throw error;
    }
  }

  async deleteSensor(pointId: string): Promise<boolean> {
    const { count } = await this.prisma.sensor.deleteMany({
      where: { monitoringPointId: pointId },
    });
    return count > 0;
  }
}
