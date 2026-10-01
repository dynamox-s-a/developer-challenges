import { Injectable } from '@nestjs/common';
import type { CreateSectorRequest, Sector, UpdateSectorRequest } from '@condition-monitor/shared';
import { PrismaService } from '../prisma/prisma.service';

const SECTOR_FIELDS = {
  id: true,
  code: true,
  name: true,
  _count: { select: { machines: true } },
} as const;

type SectorRecord = { id: string; code: string; name: string; _count: { machines: number } };

function toSector({ _count, ...sector }: SectorRecord): Sector {
  return { ...sector, machineCount: _count.machines };
}

/**
 * The only place that queries the sectors table (ADR 0002). Every query is scoped to the
 * owner (assumption A4): a sector of another user is simply not found.
 */
@Injectable()
export class SectorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Ordered by code, with the id as tiebreaker so the order is always the same. */
  async listByOwner(ownerId: string): Promise<Sector[]> {
    const sectors = await this.prisma.sector.findMany({
      where: { ownerId },
      select: SECTOR_FIELDS,
      orderBy: [{ code: 'asc' }, { id: 'asc' }],
    });
    return sectors.map(toSector);
  }

  async create(ownerId: string, data: CreateSectorRequest): Promise<Sector> {
    return toSector(
      await this.prisma.sector.create({ data: { ...data, ownerId }, select: SECTOR_FIELDS }),
    );
  }

  /** Throws Prisma's record-not-found error when the sector is missing or not owned. */
  async update(ownerId: string, id: string, data: UpdateSectorRequest): Promise<Sector> {
    return toSector(
      await this.prisma.sector.update({ where: { id, ownerId }, data, select: SECTOR_FIELDS }),
    );
  }

  countMachines(id: string): Promise<number> {
    return this.prisma.machine.count({ where: { sectorId: id } });
  }

  /** Throws Prisma's record-not-found error when the sector is missing or not owned. */
  async delete(ownerId: string, id: string): Promise<void> {
    await this.prisma.sector.delete({ where: { id, ownerId } });
  }
}
