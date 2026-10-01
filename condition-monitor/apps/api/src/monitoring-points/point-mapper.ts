import {
  buildMachineTag,
  machineTypeMapping,
  sensorModelMapping,
  type MonitoringPoint,
} from '@condition-monitor/shared';
import type { Location, MachineType, SensorModel } from '../generated/prisma/client';

/** The columns a monitoring point answer is built from, however they were queried. */
export interface PointRow {
  id: string;
  name: string;
  location: Location;
  machineId: string;
  machineName: string;
  machineType: MachineType;
  machineNumber: number;
  sectorCode: string;
  sensorSerialNumber: string | null;
  sensorModel: SensorModel | null;
}

/** One place turns stored values into API values: the tag and the model labels. */
export function toMonitoringPoint(row: PointRow): MonitoringPoint {
  const type = machineTypeMapping.fromDb(row.machineType);
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    machine: {
      id: row.machineId,
      tag: buildMachineTag(row.sectorCode, type, row.machineNumber),
      name: row.machineName,
      type,
    },
    sensor:
      row.sensorSerialNumber && row.sensorModel
        ? {
            serialNumber: row.sensorSerialNumber,
            model: sensorModelMapping.fromDb(row.sensorModel),
          }
        : null,
  };
}
