import {
  isSensorModelAllowed,
  sensorNotAllowedMessage,
  type AssignSensorInput,
  type CreateMonitoringPointInput,
  type ListMonitoringPointsQuery,
  type MonitoringPoint,
  type Paginated,
  type Sensor,
  type UpdateMonitoringPointInput,
} from "@full-stack-solution/shared";
import {
  BusinessRuleError,
  NotFoundError,
} from "../../shared/errors/app-error";
import type { MonitoringPointsRepository } from "./monitoring-points.repository";

export class MonitoringPointsService {
  constructor(private readonly repository: MonitoringPointsRepository) {}

  async createForMachine(
    machineId: string,
    userId: string,
    input: CreateMonitoringPointInput,
  ): Promise<MonitoringPoint> {
    if (!(await this.repository.machineBelongsToUser(machineId, userId))) {
      throw new NotFoundError("Machine");
    }
    return this.repository.create(userId, machineId, input.name);
  }

  list(
    userId: string,
    query: ListMonitoringPointsQuery,
  ): Promise<Paginated<MonitoringPoint>> {
    return this.repository.list(userId, query);
  }

  async rename(
    id: string,
    userId: string,
    input: UpdateMonitoringPointInput,
  ): Promise<MonitoringPoint> {
    await this.getOwnedOrThrow(id, userId);
    return this.repository.rename(id, input.name);
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!(await this.repository.delete(id, userId))) {
      throw new NotFoundError("Monitoring point");
    }
  }

  async assignSensor(
    pointId: string,
    userId: string,
    input: AssignSensorInput,
  ): Promise<Sensor> {
    const point = await this.getOwnedOrThrow(pointId, userId);

    if (!isSensorModelAllowed(point.machineType, input.model)) {
      throw new BusinessRuleError(
        sensorNotAllowedMessage(point.machineType, input.model),
      );
    }

    return this.repository.replaceSensor(pointId, userId, input);
  }

  async removeSensor(pointId: string, userId: string): Promise<void> {
    await this.getOwnedOrThrow(pointId, userId);
    if (!(await this.repository.deleteSensor(pointId))) {
      throw new NotFoundError("Sensor");
    }
  }

  private async getOwnedOrThrow(id: string, userId: string) {
    const point = await this.repository.findOwned(id, userId);
    if (!point) {
      throw new NotFoundError("Monitoring point");
    }
    return point;
  }
}
