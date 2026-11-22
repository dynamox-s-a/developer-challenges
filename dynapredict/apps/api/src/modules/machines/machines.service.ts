import {
  SENSOR_MODELS_NOT_ALLOWED,
  type MachineInput,
  type MachineType,
} from '@dynapredict/shared';
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
  await ensureSensorsAllowed(id, data.type);
  return prisma.machine.update({ where: { id }, data });
}

export async function deleteMachine(id: string) {
  await getMachine(id); // garante o 404 antes de tentar apagar
  await prisma.machine.delete({ where: { id } });
}

// A regra dos sensores vale também ao editar a máquina: ela não pode passar a
// ser de um tipo que não aceita algum sensor que já está nos pontos dela
async function ensureSensorsAllowed(machineId: string, type: MachineType) {
  // Os modelos proibidos para o novo tipo que aparecem nos pontos da máquina
  const sensors = await prisma.sensor.findMany({
    where: {
      monitoringPoint: { machineId },
      model: { in: SENSOR_MODELS_NOT_ALLOWED[type] },
    },
    select: { model: true },
    distinct: ['model'], // cada modelo uma vez só, para a mensagem
    orderBy: { model: 'asc' },
  });

  if (sensors.length > 0) {
    const models = sensors.map((sensor) => sensor.model).join(' e ');
    throw new AppError(
      409,
      'INCOMPATIBLE_SENSORS',
      `Máquinas do tipo ${type} não aceitam sensores ${models}. Troque ou remova esses sensores antes de mudar o tipo`,
    );
  }
}
