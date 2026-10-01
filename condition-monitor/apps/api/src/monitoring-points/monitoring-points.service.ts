import { Injectable } from '@nestjs/common';
import {
  isLocationAllowed,
  locationLabel,
  machineTypeMapping,
  type CreatePositionsRequest,
  type ListPointsQuery,
  type MachineType,
  type MonitoringPoint,
  type Page,
  type UpdatePointRequest,
} from '@condition-monitor/shared';
import { isUniqueViolation } from '../common/database/prisma-errors';
import { conflict, invalid, notFound } from '../common/problem/problems';
import { MonitoringPointsRepository } from './monitoring-points.repository';
import { toMonitoringPoint } from './point-mapper';

const TAKEN = 'This position already has a point on the machine.';

function notOfType(location: string, type: MachineType): string {
  return `${location} is not a position of a ${type}.`;
}

/** Monitoring point rules (assumptions B1, B2, B11, B12). The database has the last word. */
@Injectable()
export class MonitoringPointsService {
  constructor(private readonly points: MonitoringPointsRepository) {}

  async list(ownerId: string, query: ListPointsQuery): Promise<Page<MonitoringPoint>> {
    const { rows, total } = await this.points.list(ownerId, query);
    return {
      items: rows.map(toMonitoringPoint),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async get(ownerId: string, id: string): Promise<MonitoringPoint> {
    const row = await this.points.findOwned(ownerId, id);
    if (!row) throw notFound('Monitoring point');
    return toMonitoringPoint(row);
  }

  /**
   * Adds the positions selected for a machine, all or none. Positions of the other type
   * and positions already taken are refused naming each one, before any write; the
   * database index still refuses a position taken by a concurrent request.
   */
  async createPositions(
    ownerId: string,
    machineId: string,
    body: CreatePositionsRequest,
  ): Promise<{ items: MonitoringPoint[] }> {
    const machine = await this.points.findOwnedMachine(ownerId, machineId);
    if (!machine) throw notFound('Machine');
    const type = machineTypeMapping.fromDb(machine.type);

    const wrongType = body.positions.flatMap((position, index) =>
      isLocationAllowed(type, position.location)
        ? []
        : [{ field: `positions.${index}.location`, message: notOfType(position.location, type) }],
    );
    if (wrongType.length > 0) throw invalid(wrongType);

    const taken = new Set(await this.points.takenLocations(machineId));
    const clashes = body.positions.flatMap((position, index) =>
      taken.has(position.location)
        ? [{ field: `positions.${index}.location`, message: TAKEN }]
        : [],
    );
    if (clashes.length > 0) {
      throw conflict('Position in use', 'Some positions already have a point.', clashes);
    }

    try {
      const rows = await this.points.createMany(
        machineId,
        machine.type,
        body.positions.map((position) => ({
          location: position.location,
          name: position.name ?? locationLabel(position.location),
        })),
      );
      return { items: rows.map(toMonitoringPoint) };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw conflict('Position in use', 'A position was taken meanwhile. Reload and retry.', []);
      }
      throw error;
    }
  }

  async update(ownerId: string, id: string, body: UpdatePointRequest): Promise<MonitoringPoint> {
    const current = await this.points.findOwned(ownerId, id);
    if (!current) throw notFound('Monitoring point');
    const type = machineTypeMapping.fromDb(current.machineType);
    if (body.location && !isLocationAllowed(type, body.location)) {
      throw invalid([{ field: 'location', message: notOfType(body.location, type) }]);
    }
    try {
      return toMonitoringPoint(await this.points.update(id, body));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw conflict('Position in use', TAKEN, [{ field: 'location', message: TAKEN }]);
      }
      throw error;
    }
  }

  /** Removes the point and its sensor (B6). */
  async delete(ownerId: string, id: string): Promise<void> {
    if (!(await this.points.delete(ownerId, id))) throw notFound('Monitoring point');
  }
}
