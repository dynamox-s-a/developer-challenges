import * as Api from "../api";
import { MonitoringPoint } from "../entity/monitoring-point";
import RepositoryInterface from "../interface/repository";

export default class MonitoringPointRepository implements RepositoryInterface<MonitoringPoint> {

  async list() {
    return Api.listMonitoringPoints()
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