import { MonitoringPoints } from '@prisma/client';

export abstract class MonitoringPointsRepository {
  abstract create(monitoringPoint: Omit<MonitoringPoints, 'id'>): Promise<void>;
  abstract getById(id: number): Promise<MonitoringPoints | null>;
  abstract getByMonitoringPoints(
    monitoringPoint: Omit<MonitoringPoints, 'id'>,
  ): Promise<MonitoringPoints | null>;
  abstract getByMachine(machineId: number): Promise<boolean>;
  abstract getAll(): Promise<MonitoringPoints[]>;
  abstract update(monitoringPoint: MonitoringPoints): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
