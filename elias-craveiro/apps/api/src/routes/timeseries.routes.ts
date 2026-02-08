import { Router } from 'express';
import { z } from 'zod';
import { client as prisma } from '../../prisma/client';
import type { AuthedRequest } from '../middlewares/auth.middleware';

const router = Router();

// helpers
function parseDate(input: unknown): Date {
    if (typeof input === 'number') return new Date(input);
    if (typeof input === 'string') return new Date(input);
    if (input instanceof Date) return input;
    return new Date('invalid');
}

const RangeSchema = z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    limit: z.coerce.number().int().positive().optional(),
});

const StoreSchema = z.object({
    points: z
        .array(
            z.object({
                timestamp: z.union([z.string().datetime(), z.number()]), // ISO ou epoch ms
                value: z.number(),
            }),
        )
        .min(1)
        .max(20000), // limite pra não explodir
});

/**
 * Ownership check: MP pertence ao user?
 */
async function assertMPBelongsToUser(
    monitoringPointId: number,
    userId: number,
) {
    const mp = await prisma.monitoringPoint.findFirst({
        where: { id: monitoringPointId, machine: { userId } },
        select: { id: true },
    });
    return mp;
}

/**
 * POST /monitoring-points/:id/timeseries
 * body: { points: [{timestamp, value}, ...] }
 */
router.post(
    '/monitoring-points/:id/timeseries',
    async (req: AuthedRequest, res, next) => {
        try {
            const userId = Number(req.userId);
            const mpId = z.coerce
                .number()
                .int()
                .positive()
                .parse(req.params.id);
            const { points } = StoreSchema.parse(req.body);

            const mp = await assertMPBelongsToUser(mpId, userId);
            if (!mp)
                return res
                    .status(404)
                    .json({ message: 'Monitoring point not found' });

            const data = points.map((p) => {
                const ts = parseDate(p.timestamp);
                if (Number.isNaN(ts.getTime()))
                    throw new Error('Invalid timestamp');
                return {
                    monitoringPointId: mpId,
                    timestamp: ts,
                    value: p.value,
                };
            });

            // createMany é bem rápido
            const result = await prisma.timeSeriesPoint.createMany({
                data,
            });

            return res.status(201).json({ inserted: result.count });
        } catch (e) {
            next(e);
        }
    },
);

/**
 * GET /monitoring-points/:id/timeseries/count
 */
router.get(
    '/monitoring-points/:id/timeseries/count',
    async (req: AuthedRequest, res, next) => {
        try {
            const userId = Number(req.userId);
            const mpId = z.coerce
                .number()
                .int()
                .positive()
                .parse(req.params.id);

            const mp = await assertMPBelongsToUser(mpId, userId);
            if (!mp)
                return res
                    .status(404)
                    .json({ message: 'Monitoring point not found' });

            const total = await prisma.timeSeriesPoint.count({
                where: { monitoringPointId: mpId },
            });

            return res.json({ total });
        } catch (e) {
            next(e);
        }
    },
);

/**
 * GET /monitoring-points/:id/timeseries/metrics?from=&to=
 * retorna min/max/avg/count + first/last timestamps
 */
router.get(
    '/monitoring-points/:id/timeseries/metrics',
    async (req: AuthedRequest, res, next) => {
        try {
            const userId = Number(req.userId);
            const mpId = z.coerce
                .number()
                .int()
                .positive()
                .parse(req.params.id);

            const mp = await assertMPBelongsToUser(mpId, userId);
            if (!mp)
                return res
                    .status(404)
                    .json({ message: 'Monitoring point not found' });

            const { from, to } = RangeSchema.parse(req.query);

            const where: any = { monitoringPointId: mpId };
            if (from || to) {
                where.timestamp = {};
                if (from) where.timestamp.gte = new Date(from);
                if (to) where.timestamp.lte = new Date(to);
            }

            const [agg, first, last] = await Promise.all([
                prisma.timeSeriesPoint.aggregate({
                    where,
                    _count: { _all: true },
                    _min: { value: true, timestamp: true },
                    _max: { value: true, timestamp: true },
                    _avg: { value: true },
                }),
                prisma.timeSeriesPoint.findFirst({
                    where,
                    orderBy: { timestamp: 'asc' },
                    select: { timestamp: true, value: true },
                }),
                prisma.timeSeriesPoint.findFirst({
                    where,
                    orderBy: { timestamp: 'desc' },
                    select: { timestamp: true, value: true },
                }),
            ]);

            return res.json({
                count: agg._count._all,
                min: agg._min.value,
                max: agg._max.value,
                avg: agg._avg.value,
                firstTimestamp: first?.timestamp ?? null,
                lastTimestamp: last?.timestamp ?? null,
            });
        } catch (e) {
            next(e);
        }
    },
);

/**
 * GET /monitoring-points/:id/timeseries?from=&to=&limit=
 * retorna série (ordenada por timestamp)
 */
router.get(
    '/monitoring-points/:id/timeseries',
    async (req: AuthedRequest, res, next) => {
        try {
            const userId = Number(req.userId);
            const mpId = z.coerce
                .number()
                .int()
                .positive()
                .parse(req.params.id);

            const mp = await assertMPBelongsToUser(mpId, userId);
            if (!mp)
                return res
                    .status(404)
                    .json({ message: 'Monitoring point not found' });

            const { from, to, limit: limitRaw } = RangeSchema.parse(req.query);
            const limit = Math.min(limitRaw, 5000);

            const timestampFilter =
                from || to
                    ? {
                          ...(from ? { gte: from } : {}),
                          ...(to ? { lte: to } : {}),
                      }
                    : undefined;

            const where: any = {
                monitoringPointId: mpId,
                ...(timestampFilter ? { timestamp: timestampFilter } : {}),
            };

            const points = await prisma.timeSeriesPoint.findMany({
                where,
                orderBy: { timestamp: 'asc' },
                take: limit,
                select: { timestamp: true, value: true },
            });

            return res.json({
                limit,
                points: points.map((p) => ({
                    timestamp: p.timestamp.toISOString(),
                    value: p.value,
                })),
            });
        } catch (e) {
            next(e);
        }
    },
);

/**
 * DELETE /monitoring-points/:id/timeseries?from=&to=
 * se sem range: apaga tudo do MP
 */
router.delete(
    '/monitoring-points/:id/timeseries',
    async (req: AuthedRequest, res, next) => {
        try {
            const userId = Number(req.userId);
            const mpId = z.coerce
                .number()
                .int()
                .positive()
                .parse(req.params.id);

            const mp = await assertMPBelongsToUser(mpId, userId);
            if (!mp)
                return res
                    .status(404)
                    .json({ message: 'Monitoring point not found' });

            const { from, to } = RangeSchema.parse(req.query);

            const where: any = { monitoringPointId: mpId };
            if (from || to) {
                where.timestamp = {};
                if (from) where.timestamp.gte = new Date(from);
                if (to) where.timestamp.lte = new Date(to);
            }

            const result = await prisma.timeSeriesPoint.deleteMany({ where });

            return res.json({ deleted: result.count });
        } catch (e) {
            next(e);
        }
    },
);

export default router;
