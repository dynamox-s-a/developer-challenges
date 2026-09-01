import type { MachineType } from '@dynamox/domain';
import { MachineType as PrismaMachineType } from '@prisma/client';

/**
 * Tradução entre o vocabulário público do desafio (`Pump`/`Fan`) e o enum do Prisma
 * (`PUMP`/`FAN`). Vive em `common/` porque é compartilhado por máquinas e telemetria —
 * nenhum dos dois módulos deve depender do outro só por causa desta conversão.
 */
const PRISMA_TO_MACHINE_TYPE: Record<PrismaMachineType, MachineType> = {
  PUMP: 'Pump',
  FAN: 'Fan',
};

const MACHINE_TYPE_TO_PRISMA: Record<MachineType, PrismaMachineType> = {
  Pump: PrismaMachineType.PUMP,
  Fan: PrismaMachineType.FAN,
};

export function toDomainMachineType(value: PrismaMachineType): MachineType {
  return PRISMA_TO_MACHINE_TYPE[value];
}

export function toPrismaMachineType(value: MachineType): PrismaMachineType {
  return MACHINE_TYPE_TO_PRISMA[value];
}
