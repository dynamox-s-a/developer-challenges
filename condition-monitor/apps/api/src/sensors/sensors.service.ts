import { Injectable } from '@nestjs/common';
import {
  allowedSensorModels,
  buildMachineTag,
  isSensorModelAllowed,
  machineTypeMapping,
  sensorModelMapping,
  type InstallSensorRequest,
  type MonitoringPoint,
  type SensorInstallation,
} from '@condition-monitor/shared';
import { isUniqueViolation, violatedCheck } from '../common/database/prisma-errors';
import { conflict, invalid, notFound } from '../common/problem/problems';
import { MonitoringPointsRepository } from '../monitoring-points/monitoring-points.repository';
import { toMonitoringPoint } from '../monitoring-points/point-mapper';
import { SensorsRepository, type SensorPlacement } from './sensors.repository';

/**
 * Sensor rules (assumptions B3, B4, B14, B15). The challenge's pump rule is checked here
 * to explain the refusal; the database CHECK refuses it anyway, even under concurrency.
 */
@Injectable()
export class SensorsService {
  constructor(
    private readonly sensors: SensorsRepository,
    private readonly points: MonitoringPointsRepository,
  ) {}

  async install(
    ownerId: string,
    pointId: string,
    body: InstallSensorRequest,
  ): Promise<MonitoringPoint> {
    const point = await this.points.findOwned(ownerId, pointId);
    if (!point) throw notFound('Monitoring point');

    const type = machineTypeMapping.fromDb(point.machineType);
    if (!isSensorModelAllowed(type, body.model)) {
      throw invalid([
        {
          field: 'model',
          message: `${body.model} is not allowed on a ${type}. Accepted: ${allowedSensorModels(type).join(', ')}.`,
        },
      ]);
    }

    const placement = await this.sensors.findBySerial(body.serialNumber);
    if (placement && placement.monitoringPointId !== pointId) {
      throw this.installedElsewhere(body.serialNumber, placement, ownerId);
    }

    try {
      await this.sensors.install(
        pointId,
        point.machineType,
        body.serialNumber,
        sensorModelMapping.toDb(body.model),
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw conflict(
          'Sensor installed elsewhere',
          'The sensor was installed elsewhere meanwhile.',
          [{ field: 'serialNumber', message: `${body.serialNumber} is already installed.` }],
        );
      }
      if (violatedCheck(error) === 'sensors_pump_model_check') {
        throw invalid([{ field: 'model', message: 'The machine became a pump meanwhile.' }]);
      }
      throw error;
    }

    const updated = await this.points.findOwned(ownerId, pointId);
    if (!updated) throw notFound('Monitoring point');
    return toMonitoringPoint(updated);
  }

  /** The installed sensors of the user, as the simulator discovers them (C13). */
  async listInstalled(ownerId: string, serialNumbers?: string[]): Promise<SensorInstallation[]> {
    const rows = await this.sensors.listInstalled(ownerId, serialNumbers);
    return rows.map((row) => {
      const machineType = machineTypeMapping.fromDb(row.monitoringPoint.machine.type);
      return {
        serialNumber: row.serialNumber,
        model: sensorModelMapping.fromDb(row.model),
        monitoringPointId: row.monitoringPoint.id,
        location: row.monitoringPoint.location,
        machineTag: buildMachineTag(
          row.monitoringPoint.machine.sector.code,
          machineType,
          row.monitoringPoint.machine.number,
        ),
        machineType,
      };
    });
  }

  /** Removes the sensor and keeps the point, where another sensor can be installed. */
  async remove(ownerId: string, pointId: string): Promise<void> {
    const point = await this.points.findOwned(ownerId, pointId);
    if (!point) throw notFound('Monitoring point');
    if (!(await this.sensors.remove(pointId))) throw notFound('Sensor');
  }

  /**
   * A serial number is unique across the system (B4). The user is told where their own
   * sensor is; for another user's, only that it is taken, since the serial number cannot
   * be registered twice but nothing else about it may leak (A4).
   */
  private installedElsewhere(serialNumber: string, placement: SensorPlacement, ownerId: string) {
    const where =
      placement.ownerId === ownerId
        ? ` at ${buildMachineTag(
            placement.sectorCode,
            machineTypeMapping.fromDb(placement.machineType),
            placement.machineNumber,
          )}, ${placement.pointName}. Remove it there first`
        : ' elsewhere';
    return conflict('Sensor installed elsewhere', `Sensor ${serialNumber} is installed${where}.`, [
      { field: 'serialNumber', message: `${serialNumber} is installed${where}.` },
    ]);
  }
}
