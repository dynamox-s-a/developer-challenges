import { Injectable } from '@nestjs/common';
import type { Overview } from '@condition-monitor/shared';
import { PrismaService } from '../prisma/prisma.service';

/**
 * The counts of one user, read in one statement, so they come from one snapshot and
 * cannot disagree with each other (E1).
 */
@Injectable()
export class OverviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countsOf(ownerId: string): Promise<Overview> {
    const [row] = await this.prisma.$queryRaw<Overview[]>`
      WITH s AS (SELECT id FROM sectors WHERE owner_id = ${ownerId}::uuid),
           m AS (SELECT id FROM machines WHERE sector_id IN (SELECT id FROM s)),
           p AS (SELECT id FROM monitoring_points WHERE machine_id IN (SELECT id FROM m)),
           t AS (SELECT id FROM time_series WHERE monitoring_point_id IN (SELECT id FROM p))
      SELECT (SELECT count(*) FROM s)::int AS sectors,
             (SELECT count(*) FROM m)::int AS machines,
             (SELECT count(*) FROM p)::int AS "monitoringPoints",
             (SELECT count(*) FROM sensors WHERE monitoring_point_id IN (SELECT id FROM p))::int
               AS sensors,
             (SELECT count(*) FROM t)::int AS "timeSeries",
             -- The count each series keeps, not millions of rows read on every visit.
             (SELECT coalesce(sum(reading_count), 0) FROM time_series
               WHERE id IN (SELECT id FROM t))::int AS readings`;
    return row;
  }
}
