import type { MachineInput } from '@dynapredict/shared';
import { AppError } from '../../errors/app-error.ts';
import { prisma } from '../../lib/prisma.ts';

// Todas as máquinas, das mais novas para as mais antigas
export function listMachines() {
  return prisma.machine.findMany({ orderBy: { createdAt: 'desc' } });
}

// Uma máquina pelo id. Se não existir, lança 404
export async function getMachine(id: string) {
  const machine = await prisma.machine.findUnique({ where: { id } });

  if (!machine) {
    throw new AppError(404, 'NOT_FOUND', 'Máquina não encontrada');
  }

  return machine;
}

// "data" já chega validado pelo machineSchema (nome sem espaços nas pontas)
export function createMachine(data: MachineInput) {
  return prisma.machine.create({ data });
}

export async function updateMachine(id: string, data: MachineInput) {
  await getMachine(id); // garante o 404 antes de tentar atualizar
  return prisma.machine.update({ where: { id }, data });
}

export async function deleteMachine(id: string) {
  await getMachine(id); // garante o 404 antes de tentar apagar
  await prisma.machine.delete({ where: { id } });
}
