import { Injectable } from '@nestjs/common';
import type { MachineSortKey, SortOrder } from '@condition-monitor/shared';
import type { MachineType, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const MACHINE_FIELDS = {
  id: true,
  type: true,
  number: true,
  name: true,
  sector: { select: { id: true, code: true, name: true } },
} as const;

export type MachineRecord = Prisma.MachineGetPayload<{ select: typeof MACHINE_FIELDS }>;

export interface MachineWrite {
  sectorId: string;
  type: MachineType;
  number: number;
  name: string;
}

/**
 * Sort criteria per column. Each ends in the primary key, so two machines equal on every
 * visible column still have a fixed order and never skip or repeat between pages (B8).
 * Sorting by tag follows the tag itself: sector code, then type, then number.
 */
function orderBy(sort: MachineSortKey, order: SortOrder): Prisma.MachineOrderByWithRelationInput[] {
  const byTag: Prisma.MachineOrderByWithRelationInput[] = [
    { sector: { code: order } },
    { type: order },
    { number: order },
  ];
  const leading: Record<MachineSortKey, Prisma.MachineOrderByWithRelationInput[]> = {
    tag: byTag,
    name: [{ name: order }, ...byTag],
    type: [{ type: order }, { sector: { code: order } }, { number: order }],
    sector: [{ sector: { name: order } }, ...byTag],
  };
  return [...leading[sort], { id: 'asc' }];
}

/**
 * The only place that queries the machines table (ADR 0002). A machine belongs to the
 * user who owns its sector, and every query is scoped that way (assumption A4).
 */
@Injectable()
export class MachinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * A page and the total of the same filter. Under PostgreSQL's default isolation each
   * statement sees its own moment, so a machine created in between would make them
   * disagree; REPEATABLE READ gives both reads the same snapshot.
   */
  async list(
    ownerId: string,
    query: {
      page: number;
      pageSize: number;
      sort: MachineSortKey;
      order: SortOrder;
      sectorId?: string;
    },
  ): Promise<{ items: MachineRecord[]; total: number }> {
    const where: Prisma.MachineWhereInput = {
      sector: { ownerId },
      ...(query.sectorId ? { sectorId: query.sectorId } : {}),
    };
    const [total, items] = await this.prisma.$transaction(
      [
        this.prisma.machine.count({ where }),
        this.prisma.machine.findMany({
          where,
          select: MACHINE_FIELDS,
          orderBy: orderBy(query.sort, query.order),
          skip: (query.page - 1) * query.pageSize,
          take: query.pageSize,
        }),
      ],
      { isolationLevel: 'RepeatableRead' },
    );
    return { items, total };
  }

  findOwned(ownerId: string, id: string): Promise<MachineRecord | null> {
    return this.prisma.machine.findFirst({
      where: { id, sector: { ownerId } },
      select: MACHINE_FIELDS,
    });
  }

  /** The owner's sector, or null when it does not exist or belongs to someone else. */
  findOwnedSector(ownerId: string, sectorId: string) {
    return this.prisma.sector.findFirst({
      where: { id: sectorId, ownerId },
      select: { id: true, code: true },
    });
  }

  async highestNumber(sectorId: string, type: MachineType): Promise<number | null> {
    const { _max } = await this.prisma.machine.aggregate({
      where: { sectorId, type },
      _max: { number: true },
    });
    return _max.number;
  }

  create(data: MachineWrite): Promise<MachineRecord> {
    return this.prisma.machine.create({ data, select: MACHINE_FIELDS });
  }

  update(id: string, data: Partial<MachineWrite>): Promise<MachineRecord> {
    return this.prisma.machine.update({ where: { id }, data, select: MACHINE_FIELDS });
  }

  /** Deletes only an owned machine; answers whether one was deleted. */
  async delete(ownerId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.machine.deleteMany({
      where: { id, sector: { ownerId } },
    });
    return count === 1;
  }
}
