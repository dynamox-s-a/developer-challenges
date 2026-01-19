import * as Api from "../api";
import { MonitoringPoint } from "../entity/monitoring-point";
import type { Machine } from "../entity/machine";
import RepositoryInterface from "../interface/repository";

type MonitoringPointRow = MonitoringPoint & {
  machine: Machine
};

export default class MonitoringPointRepository implements RepositoryInterface<MonitoringPoint> {

  async list() {
    const result = await Api.listMonitoringPoints();
    return result.map((row: MonitoringPointRow) => {

      return {
        ...row,
        machineType: row.machine.type,
        machineName: row.machine.name,
      } as MonitoringPoint
    })
  }

  async create(monitoringPoint: MonitoringPoint) {
    return Api.createMonitoringPoint(monitoringPoint.name, monitoringPoint.type, monitoringPoint.machineId)
  }

  async update(monitoringPoint: MonitoringPoint) {
    return Api.updateMonitoringPoint(monitoringPoint)
  }

  async delete(monitoringPoint: MonitoringPoint) {
    return Api.deleteMonitoringPoint(monitoringPoint)
  }
}