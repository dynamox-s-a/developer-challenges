import { Inject, Injectable } from '@nestjs/common';
import { monitoringPointsTable } from 'src/modules/drizzle/schema';
import { machinesTable } from 'src/modules/drizzle/schema';
import {
  DRIZZLE,
  type DrizzleConnection,
} from 'src/modules/drizzle/drizzle.module';
import MonitoringPoint, {
  MonitoringPointType,
} from 'src/entities/monitoring-point.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class MonitoringPointRepository {
  constructor(@Inject(DRIZZLE) private drizzleConnection: DrizzleConnection) {}

  async list(): Promise<MonitoringPoint[]> {
    try {
      const monitoringPointsData = await this.drizzleConnection
        .select()
        .from(monitoringPointsTable)
        .leftJoin(
          machinesTable,
          eq(machinesTable.id, monitoringPointsTable.machineId),
        );
      if (!monitoringPointsData) {
        throw new Error('error monitoring');
      }
      return monitoringPointsData.map((row) => {
        const machine = row.machines_table;
        return { machine, ...row.monitoring_points_table } as MonitoringPoint;
      });
    } catch (error) {
      console.error('Error on MonitoringPointRepository.list', error);
      return [];
    }
  }

  async find(id: number): Promise<MonitoringPoint | null> {
    try {
      const result = await this.drizzleConnection
        .select()
        .from(monitoringPointsTable)
        .leftJoin(
          machinesTable,
          eq(machinesTable.id, monitoringPointsTable.machineId),
        )
        .where(eq(monitoringPointsTable.id, id));

      const row = result[0];
      const machine = row.machines_table;
      return { machine, ...row.monitoring_points_table } as MonitoringPoint;
    } catch (error) {
      console.error('Error on MonitoringPointRepository.get', error);
      return null;
    }
  }

  async create(
    name: string,
    type: MonitoringPointType,
    machineId: number,
  ): Promise<boolean> {
    const newMonitoringPoint: typeof monitoringPointsTable.$inferInsert = {
      name,
      type,
      machineId,
    };
    try {
      const result = await this.drizzleConnection
        .insert(monitoringPointsTable)
        .values(newMonitoringPoint);

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error on MonitoringPointRepository.create', error);
      return false;
    }
  }

  async update(
    id: number,
    name: string,
    type: MonitoringPointType,
    machineId: number,
  ): Promise<boolean> {
    try {
      const result = await this.drizzleConnection
        .update(monitoringPointsTable)
        .set({ name, type, machineId })
        .where(eq(monitoringPointsTable.id, id));

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error on MonitoringPointRepository.update', error);
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.drizzleConnection
        .delete(monitoringPointsTable)
        .where(eq(monitoringPointsTable.id, id));

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error on MonitoringPointRepository.delete', error);
      return false;
    }
  }
}
