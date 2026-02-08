import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../prisma.js";
import "../types/fastify.d.ts";

const paramsSchema = z.object({
  id: z.string().min(1),
});

const createSchema = z.object({
  timestamp: z.string().datetime(),
  value: z.number(),
});

const listQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  take: z.coerce.number().int().min(1).max(500).default(100),
  skip: z.coerce.number().int().min(0).default(0),
});

export async function timeSeriesRoutes(app: FastifyInstance) {
  app.post("/monitoring-points/:id/time-series", { preHandler: [app.authenticate] }, async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    const body = createSchema.parse(req.body);

    const mp = await prisma.monitoringPoint.findUnique({ where: { id } });
    if (!mp) return reply.code(404).send({ message: "Monitoring point not found" });

    const created = await prisma.timeSeries.create({
      data: {
        monitoringPointId: id,
        timestamp: new Date(body.timestamp),
        value: body.value,
      },
    });

    return reply.code(201).send(created);
  });

  app.get("/monitoring-points/:id/time-series", { preHandler: [app.authenticate] }, async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    const query = listQuerySchema.parse(req.query);

    const mp = await prisma.monitoringPoint.findUnique({ where: { id } });
    if (!mp) return reply.code(404).send({ message: "Monitoring point not found" });

    const where = {
      monitoringPointId: id,
      ...(query.from || query.to
        ? {
            timestamp: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.timeSeries.findMany({
        where,
        orderBy: { timestamp: "asc" },
        take: query.take,
        skip: query.skip,
      }),
      prisma.timeSeries.count({ where }),
    ]);

    return reply.send({ items, total, take: query.take, skip: query.skip });
  });

  app.get("/monitoring-points/:id/time-series/metrics", { preHandler: [app.authenticate] }, async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    const query = z
      .object({
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
      })
      .parse(req.query);

    const mp = await prisma.monitoringPoint.findUnique({ where: { id } });
    if (!mp) return reply.code(404).send({ message: "Monitoring point not found" });

    const where = {
      monitoringPointId: id,
      ...(query.from || query.to
        ? {
            timestamp: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [count, agg] = await Promise.all([
      prisma.timeSeries.count({ where }),
      prisma.timeSeries.aggregate({
        where,
        _min: { value: true },
        _max: { value: true },
        _avg: { value: true },
      }),
    ]);

    return reply.send({
      count,
      min: agg._min.value,
      max: agg._max.value,
      avg: agg._avg.value,
    });
  });

  app.delete("/monitoring-points/:id/time-series", { preHandler: [app.authenticate] }, async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);

    const mp = await prisma.monitoringPoint.findUnique({ where: { id } });
    if (!mp) return reply.code(404).send({ message: "Monitoring point not found" });

    const result = await prisma.timeSeries.deleteMany({
      where: { monitoringPointId: id },
    });

    return reply.send({ deleted: result.count });
  });
}