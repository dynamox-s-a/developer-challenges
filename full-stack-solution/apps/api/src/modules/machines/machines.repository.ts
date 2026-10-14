import {
  getBlockedSensorModels,
  type CreateMachineInput,
  type Machine,
  type MachineType,
  type UpdateMachineInput,
} from "@full-stack-solution/shared";
import type { PrismaClient } from "../../generated/prisma/client";
import { toDatabaseSensorModel } from "../../shared/database/sensor-model.mapper";

export interface MachinesRepository {
  findAllByUser(userId: string): Promise<Machine[]>;
  findOwned(id: string, userId: string): Promise<Machine | null>;
  create(userId: string, data: CreateMachineInput): Promise<Machine>;
  update(id: string, data: UpdateMachineInput): Promise<Machine>;
  delete(id: string, userId: string): Promise<boolean>;
  hasSensorsBlockedForPump(machineId: string): Promise<boolean>;
}

const machineSelect = {
  id: true,
  name: true,
  type: true,
  _count: { select: { monitoringPoints: true } },
} as const;

interface MachineRow {
  id: string;
  name: string;
  type: MachineType;
  _count: { monitoringPoints: number };
}

function toMachine(row: MachineRow): Machine {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    monitoringPointsCount: row._count.monitoringPoints,
  };
}

export class PrismaMachinesRepository implements MachinesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllByUser(userId: string): Promise<Machine[]> {
    const rows = await this.prisma.machine.findMany({
      where: { createdById: userId },
      select: machineSelect,
      orderBy: [{ name: "asc" }, { id: "asc" }],
    });
    return rows.map(toMachine);
  }

  async findOwned(id: string, userId: string): Promise<Machine | null> {
    const row = await this.prisma.machine.findFirst({
      where: { id, createdById: userId },
      select: machineSelect,
    });
    return row ? toMachine(row) : null;
  }

  async create(userId: string, data: CreateMachineInput): Promise<Machine> {
    const row = await this.prisma.machine.create({
      data: { name: data.name, type: data.type, createdById: userId },
      select: machineSelect,
    });
    return toMachine(row);
  }

  async update(id: string, data: UpdateMachineInput): Promise<Machine> {
    const row = await this.prisma.machine.update({
      where: { id },
      data,
      select: machineSelect,
    });
    return toMachine(row);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { count } = await this.prisma.machine.deleteMany({
      where: { id, createdById: userId },
    });
    return count > 0;
  }

  async hasSensorsBlockedForPump(machineId: string): Promise<boolean> {
    const blocked = getBlockedSensorModels("Pump").map(toDatabaseSensorModel);
    const count = await this.prisma.sensor.count({
      where: {
        model: { in: blocked },
        monitoringPoint: { machineId },
      },
    });
    return count > 0;
  }
}
