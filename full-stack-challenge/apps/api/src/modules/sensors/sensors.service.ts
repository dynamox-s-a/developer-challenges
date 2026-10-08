import {
  type MachineType,
  type SensorDto,
  type SensorModel,
  isSensorCompatibleWithMachine,
  sensorModelFromKey,
  sensorModelToKey,
} from '@dynapredict/shared-types';
import { AppError } from '../../errors/AppError';
import { lockMachine } from '../../lib/locks';
import { prisma } from '../../lib/prisma';
import {
  isUniqueViolation,
  uniqueViolationFields,
} from '../../lib/prismaErrors';
import type { AttachSensorInput } from './sensors.schemas';

/** Throws 422 when the sensor model is not allowed on the machine type. */
export function assertSensorCompatibleWithMachine(
  machineType: MachineType,
  sensorModel: SensorModel,
): void {
  if (!isSensorCompatibleWithMachine(machineType, sensorModel)) {
    throw AppError.unprocessable(
      `${sensorModel} sensors cannot be used on ${machineType} machines`,
      { machineType, sensorModel },
    );
  }
}

/**
 * Installs a sensor on a monitoring point. The machine lock serializes this
 * with machine type changes, so the compatibility check can't go stale before
 * the insert commits.
 */
export async function attachSensor(
  pointId: string,
  input: AttachSensorInput,
): Promise<SensorDto> {
  return prisma.$transaction(async (tx) => {
    const target = await tx.monitoringPoint.findUnique({
      where: { id: pointId },
      select: { machineId: true },
    });
    if (!target) throw AppError.notFound('Monitoring point not found');
    await lockMachine(tx, target.machineId);

    // Re-read under the lock: the point, its sensor or the machine type may
    // have changed while we waited.
    const point = await tx.monitoringPoint.findUnique({
      where: { id: pointId },
      select: {
        machine: { select: { type: true } },
        sensor: { select: { id: true } },
      },
    });
    if (!point) throw AppError.notFound('Monitoring point not found');
    if (point.sensor) {
      throw AppError.conflict('Monitoring point already has a sensor');
    }
    assertSensorCompatibleWithMachine(point.machine.type, input.model);

    try {
      const sensor = await tx.sensor.create({
        data: {
          serialNumber: input.serialNumber,
          model: sensorModelToKey(input.model),
          monitoringPointId: pointId,
        },
      });
      return {
        id: sensor.id,
        serialNumber: sensor.serialNumber,
        model: sensorModelFromKey(sensor.model),
        monitoringPointId: sensor.monitoringPointId,
        createdAt: sensor.createdAt.toISOString(),
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        if (uniqueViolationFields(error).includes('serialNumber')) {
          throw AppError.conflict('Serial number already in use', {
            fields: ['serialNumber'],
          });
        }
        throw AppError.conflict('Monitoring point already has a sensor');
      }
      throw error;
    }
  });
}

/** Removes the sensor from its point; the database cascades to its readings. */
export async function removeSensor(id: string): Promise<void> {
  const { count } = await prisma.sensor.deleteMany({ where: { id } });
  if (count === 0) throw AppError.notFound('Sensor not found');
}
