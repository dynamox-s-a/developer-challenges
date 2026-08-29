import type {
  AttachSensorRequest,
  CreateMonitoringPointRequest,
  MonitoringPoint,
  MonitoringPointListQuery,
  Sensor,
} from "@dyn/contracts";
import { MONITORING_POINT_PAGE_SIZE } from "@dyn/contracts";
import type { MonitoringPointRow, SensorRow } from "@dyn/database";

import { ConflictError, NotFoundError, SensorIncompatibleError } from "../../shared/errors.js";
import { incompatibleMachineTypes, pumpSensorModel } from "../../shared/sensor-compatibility.js";
import type { MachineRepository } from "../machines/repository.js";
import type { MonitoringPointRepository } from "./repository.js";

// Listing points first proves the machine exists, so this slice borrows exactly one machine read.
type MonitoringPointServiceRepository = MonitoringPointRepository &
  Pick<MachineRepository, "findMachine">;

function toSensor(row: SensorRow): Sensor {
  return {
    id: row.id,
    monitoringPointId: row.monitoringPointId,
    model: row.model,
    createdAt: row.createdAt.toISOString(),
  };
}

function toMonitoringPoint(row: MonitoringPointRow, sensor: SensorRow | null): MonitoringPoint {
  return {
    id: row.id,
    machineId: row.machineId,
    name: row.name,
    sensor: sensor ? toSensor(sensor) : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function createMonitoringPointService(repository: MonitoringPointServiceRepository) {
  return {
    async create(machineId: string, input: CreateMonitoringPointRequest) {
      const point = await repository.createMonitoringPoint(machineId, input.name);
      if (!point) {
        throw new NotFoundError("Machine");
      }
      return toMonitoringPoint(point, null);
    },

    async listForMachine(machineId: string) {
      const machine = await repository.findMachine(machineId);
      if (!machine) {
        throw new NotFoundError("Machine");
      }

      const points = await repository.listMonitoringPointsForMachine(machineId);
      return points.map(({ point, sensor }) => toMonitoringPoint(point, sensor));
    },

    async attachSensor(monitoringPointId: string, input: AttachSensorRequest) {
      const outcome = await repository.attachSensor({
        id: input.sensorId,
        monitoringPointId,
        model: input.model,
        rejectedMachineTypes: incompatibleMachineTypes(input.model),
      });

      if (outcome.status === "not-found") {
        throw new NotFoundError("Monitoring point");
      }

      if (outcome.status === "incompatible") {
        throw new SensorIncompatibleError(`Pump machines only support ${pumpSensorModel} sensors`, [
          { path: "model", message: `Select ${pumpSensorModel} for a Pump machine` },
        ]);
      }

      if (outcome.status === "conflict") {
        if (outcome.reason === "monitoring-point") {
          throw new ConflictError("Monitoring point already has a sensor");
        }
        if (outcome.reason === "sensor-id") {
          throw new ConflictError("Sensor ID is already associated with another monitoring point");
        }
        throw new ConflictError("Sensor ID or monitoring-point association is already in use");
      }

      return toSensor(outcome.sensor);
    },

    async list(query: MonitoringPointListQuery) {
      const result = await repository.listMonitoringPoints(query);
      return {
        items: result.items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
        page: query.page,
        pageSize: MONITORING_POINT_PAGE_SIZE,
        total: result.total,
        totalPages: Math.ceil(result.total / MONITORING_POINT_PAGE_SIZE),
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      };
    },
  };
}

export type MonitoringPointService = ReturnType<typeof createMonitoringPointService>;
