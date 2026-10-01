import { Injectable } from '@nestjs/common';
import type { PointSortKey, SortOrder } from '@condition-monitor/shared';
import { Prisma, type Location, type MachineType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { PointRow } from './point-mapper';

const POINT_INCLUDE = {
  machine: {
    select: { id: true, name: true, type: true, number: true, sector: { select: { code: true } } },
  },
  sensor: { select: { serialNumber: true, model: true } },
} as const;

type PointRecord = Prisma.MonitoringPointGetPayload<{ include: typeof POINT_INCLUDE }>;

function toRow(point: PointRecord): PointRow {
  return {
    id: point.id,
    name: point.name,
    location: point.location,
    machineId: point.machine.id,
    machineName: point.machine.name,
    machineType: point.machine.type,
    machineNumber: point.machine.number,
    sectorCode: point.machine.sector.code,
    sensorSerialNumber: point.sensor?.serialNumber ?? null,
    sensorModel: point.sensor?.model ?? null,
  };
}

/**
 * ORDER BY per column of the challenge list. Each ends in the tag, the position and the
 * primary key, so rows equal on the visible column keep a fixed order and never skip or
 * repeat between pages (B8). A point without a sensor sorts last in both directions (B7),
 * which Prisma cannot express for an optional relation, hence SQL.
 *
 * `direction` only ever comes from the validated sort order, never from free text.
 */
function orderBy(sort: PointSortKey, order: SortOrder): Prisma.Sql {
  const direction = Prisma.raw(order === 'desc' ? 'DESC' : 'ASC');
  const tag = Prisma.sql`s.code ${direction}, m.type ${direction}, m.number ${direction}`;
  const tail = Prisma.sql`p.location ASC, p.id ASC`;
  const leading: Record<PointSortKey, Prisma.Sql> = {
    machineName: Prisma.sql`m.name ${direction}, ${tag}, ${tail}`,
    machineType: Prisma.sql`m.type ${direction}, s.code ASC, m.number ASC, ${tail}`,
    monitoringPointName: Prisma.sql`p.name ${direction}, s.code ASC, m.type ASC, m.number ASC, ${tail}`,
    sensorModel: Prisma.sql`(se.model IS NULL) ASC, se.model ${direction}, s.code ASC, m.type ASC, m.number ASC, ${tail}`,
    machineTag: Prisma.sql`${tag}, ${tail}`,
    location: Prisma.sql`p.location ${direction}, s.code ASC, m.type ASC, m.number ASC, p.id ASC`,
  };
  return leading[sort];
}

/**
 * The only place that queries the monitoring points table (ADR 0002). A point belongs to
 * the user who owns its machine's sector (assumption A4).
 */
@Injectable()
export class MonitoringPointsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * A page of the challenge list and its total, from one snapshot (REPEATABLE READ), so a
   * point created in between cannot make them disagree.
   */
  async list(
    ownerId: string,
    query: { page: number; pageSize: number; sort: PointSortKey; order: SortOrder },
  ): Promise<{ rows: PointRow[]; total: number }> {
    const from = Prisma.sql`
      FROM monitoring_points p
      JOIN machines m ON m.id = p.machine_id
      JOIN sectors s ON s.id = m.sector_id
      LEFT JOIN sensors se ON se.monitoring_point_id = p.id
      WHERE s.owner_id = ${ownerId}::uuid`;
    const [counted, rows] = await this.prisma.$transaction(
      [
        this.prisma.$queryRaw<{ total: number }[]>`SELECT count(*)::int AS total ${from}`,
        this.prisma.$queryRaw<PointRow[]>`
          SELECT p.id, p.name, p.location,
                 m.id AS "machineId", m.name AS "machineName", m.type AS "machineType",
                 m.number AS "machineNumber", s.code AS "sectorCode",
                 se.serial_number AS "sensorSerialNumber", se.model AS "sensorModel"
          ${from}
          ORDER BY ${orderBy(query.sort, query.order)}
          LIMIT ${query.pageSize} OFFSET ${(query.page - 1) * query.pageSize}`,
      ],
      { isolationLevel: 'RepeatableRead' },
    );
    return { rows, total: counted[0].total };
  }

  async findOwned(ownerId: string, id: string): Promise<PointRow | null> {
    const point = await this.prisma.monitoringPoint.findFirst({
      where: { id, machine: { sector: { ownerId } } },
      include: POINT_INCLUDE,
    });
    return point ? toRow(point) : null;
  }

  /** The points of one machine, in power-flow order. */
  async listByMachine(machineId: string): Promise<PointRow[]> {
    const points = await this.prisma.monitoringPoint.findMany({
      where: { machineId },
      include: POINT_INCLUDE,
      orderBy: [{ location: 'asc' }, { name: 'asc' }, { id: 'asc' }],
    });
    return points.map(toRow);
  }

  findOwnedMachine(ownerId: string, id: string) {
    return this.prisma.machine.findFirst({
      where: { id, sector: { ownerId } },
      select: { id: true, type: true },
    });
  }

  /** The positions already taken on a machine, OTHER excluded since it may repeat. */
  async takenLocations(machineId: string): Promise<Location[]> {
    const points = await this.prisma.monitoringPoint.findMany({
      where: { machineId, location: { not: 'OTHER' } },
      select: { location: true },
    });
    return points.map((point) => point.location);
  }

  /** Creates all positions or none: a refused one leaves the machine as it was. */
  async createMany(
    machineId: string,
    machineType: MachineType,
    positions: { location: Location; name: string }[],
  ): Promise<PointRow[]> {
    const ids = await this.prisma.$transaction(
      positions.map((position) =>
        this.prisma.monitoringPoint.create({
          data: { machineId, machineType, ...position },
          select: { id: true },
        }),
      ),
    );
    const points = await this.prisma.monitoringPoint.findMany({
      where: { id: { in: ids.map(({ id }) => id) } },
      include: POINT_INCLUDE,
      orderBy: [{ location: 'asc' }, { id: 'asc' }],
    });
    return points.map(toRow);
  }

  async update(id: string, data: { name?: string; location?: Location }): Promise<PointRow> {
    return toRow(
      await this.prisma.monitoringPoint.update({ where: { id }, data, include: POINT_INCLUDE }),
    );
  }

  /** Deletes an owned point with its sensor; answers whether one was deleted. */
  async delete(ownerId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.monitoringPoint.deleteMany({
      where: { id, machine: { sector: { ownerId } } },
    });
    return count === 1;
  }

  async countsOfMachine(machineId: string) {
    const [monitoringPoints, sensors] = await this.prisma.$transaction([
      this.prisma.monitoringPoint.count({ where: { machineId } }),
      this.prisma.sensor.count({ where: { monitoringPoint: { machineId } } }),
    ]);
    return { monitoringPoints, sensors };
  }
}
