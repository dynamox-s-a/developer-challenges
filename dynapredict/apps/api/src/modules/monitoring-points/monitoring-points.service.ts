import type { MonitoringPointInput } from '@dynapredict/shared';
import { AppError } from '../../errors/app-error.ts';
import { prisma } from '../../lib/prisma.ts';
import { getMachine } from '../machines/machines.service.ts';

// Um ponto pelo id. Se não existir, lança 404
export async function getMonitoringPoint(id: string) {
  const point = await prisma.monitoringPoint.findUnique({ where: { id } });

  if (!point) {
    throw new AppError(
      404,
      'NOT_FOUND',
      'Ponto de monitoramento não encontrado',
    );
  }

  return point;
}

// "data" já chega validado pelo monitoringPointSchema
export async function createMonitoringPoint(
  machineId: string,
  data: MonitoringPointInput,
) {
  await getMachine(machineId); // 404 se a máquina não existir
  return prisma.monitoringPoint.create({ data: { ...data, machineId } });
}

export async function deleteMonitoringPoint(id: string) {
  await getMonitoringPoint(id); // garante o 404 antes de tentar apagar
  await prisma.monitoringPoint.delete({ where: { id } });
}
