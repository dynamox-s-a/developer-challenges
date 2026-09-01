import type { Axis as DomainAxis, PhysicalQuantity } from '@dynamox/domain';
import { Axis, PhysicalQuantity as PrismaPhysicalQuantity } from '@prisma/client';

// Reexportado de common/: a conversão de modelo de sensor passou a ser compartilhada
// com o módulo de pontos de monitoramento.
export { toDomainSensorModel, toPrismaSensorModel } from '../common/sensor-model.mapper';

const PHYSICAL_QUANTITY_TO_PRISMA: Record<PhysicalQuantity, PrismaPhysicalQuantity> = {
  acceleration: PrismaPhysicalQuantity.ACCELERATION,
  velocity: PrismaPhysicalQuantity.VELOCITY,
  temperature: PrismaPhysicalQuantity.TEMPERATURE,
  rotationalSpeed: PrismaPhysicalQuantity.ROTATIONAL_SPEED,
};

const PRISMA_TO_PHYSICAL_QUANTITY: Record<PrismaPhysicalQuantity, PhysicalQuantity> = {
  ACCELERATION: 'acceleration',
  VELOCITY: 'velocity',
  TEMPERATURE: 'temperature',
  ROTATIONAL_SPEED: 'rotationalSpeed',
};

const AXIS_TO_PRISMA: Record<DomainAxis, Axis> = {
  x: Axis.X,
  y: Axis.Y,
  z: Axis.Z,
};

export function toPrismaPhysicalQuantity(value: PhysicalQuantity): PrismaPhysicalQuantity {
  return PHYSICAL_QUANTITY_TO_PRISMA[value];
}

export function toDomainPhysicalQuantity(value: PrismaPhysicalQuantity): PhysicalQuantity {
  return PRISMA_TO_PHYSICAL_QUANTITY[value];
}

/** Grandezas não direcionais (temperatura) são persistidas como NONE, nunca NULL. */
export function toPrismaAxis(value: DomainAxis | undefined): Axis {
  return value ? AXIS_TO_PRISMA[value] : Axis.NONE;
}

export function toDomainAxis(value: Axis): DomainAxis | null {
  return value === Axis.NONE ? null : (value.toLowerCase() as DomainAxis);
}
