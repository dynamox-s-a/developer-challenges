import { MachineType } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../shared/errors';
import {
  assertSensorAllowedForMachine,
  toSharedSensorModel,
} from '../monitoring-points/monitoring-points.mappers';
import type { CreateMachineInput, UpdateMachineInput } from './machines.schemas';

function mapMachine(machine: {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { monitoringPoints: number };
}) {
  return {
    id: machine.id,
    name: machine.name,
    type: machine.type,
    monitoringPointsCount: machine._count?.monitoringPoints ?? 0,
    createdAt: machine.createdAt.toISOString(),
    updatedAt: machine.updatedAt.toISOString(),
  };
}

export async function listMachines() {
  const machines = await prisma.machine.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { monitoringPoints: true } },
    },
  });
  return machines.map(mapMachine);
}

export async function getMachine(id: string) {
  const machine = await prisma.machine.findUnique({
    where: { id },
    include: {
      _count: { select: { monitoringPoints: true } },
    },
  });
  if (!machine) {
    throw new AppError(404, 'Machine not found');
  }
  return mapMachine(machine);
}

export async function createMachine(input: CreateMachineInput) {
  const machine = await prisma.machine.create({
    data: input,
    include: {
      _count: { select: { monitoringPoints: true } },
    },
  });
  return mapMachine(machine);
}

export async function updateMachine(id: string, input: UpdateMachineInput) {
  await getMachine(id);

  if (input.type === MachineType.Pump) {
    const points = await prisma.monitoringPoint.findMany({
      where: { machineId: id },
      include: { sensor: true },
    });

    const incompatible = points.filter(
      (point) =>
        point.sensor &&
        !assertSensorAllowedForMachine(
          MachineType.Pump,
          toSharedSensorModel[point.sensor.model]
        )
    );

    if (incompatible.length > 0) {
      const details = incompatible
        .map((point) => `${point.name} (${point.sensor!.id}: ${point.sensor!.model})`)
        .join(', ');
      throw new AppError(
        400,
        `Cannot change machine type to Pump while monitoring points have TcAg/TcAs sensors. Remove or replace them first: ${details}`
      );
    }
  }

  const machine = await prisma.machine.update({
    where: { id },
    data: input,
    include: {
      _count: { select: { monitoringPoints: true } },
    },
  });
  return mapMachine(machine);
}

export async function deleteMachine(id: string) {
  await getMachine(id);
  await prisma.machine.delete({ where: { id } });
}
