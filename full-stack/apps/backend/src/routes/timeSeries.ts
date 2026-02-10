import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../prisma.js";
import type { FastifyRequest } from "fastify";

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

  app.get("/time-series/count", { preHandler: [app.authenticate] }, async (req, reply) => {
    const query = z
      .object({
        monitoringPointId: z.string().optional(),
      })
      .parse(req.query);

    const where = query.monitoringPointId 
      ? { monitoringPointId: query.monitoringPointId }
      : {};

    const count = await prisma.timeSeries.count({ where });

    return reply.send({ 
      count,
      ...(query.monitoringPointId ? { monitoringPointId: query.monitoringPointId } : {})
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

  app.get("/monitoring-points/:id/time-series/predict", {
    preHandler: [app.authenticate],
  }, async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    const query = z.object({
      periods: z.coerce.number().int().min(1).max(100).default(10), 
      interval: z.enum(["15min", "1hour", "1day"]).default("15min"),
    }).parse(req.query);

    const historicalData = await prisma.timeSeries.findMany({
      where: { monitoringPointId: id },
      orderBy: { timestamp: "asc" },
      take: 100,
    });

    if (historicalData.length < 10) {
      return reply.badRequest("Not enough historical data for prediction (minimum 10 points required)");
    }

    const values = historicalData.map(d => d.value);
    const n = values.length;
    
    const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = Array.from({ length: n }, (_, i) => i * values[i]).reduce((a, b) => a + b, 0);
    const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictions = [];
    const lastTimestamp = historicalData[historicalData.length - 1].timestamp;
    const intervalMs = query.interval === "15min" ? 15 * 60 * 1000 : 
                      query.interval === "1hour" ? 60 * 60 * 1000 : 
                      24 * 60 * 60 * 1000;
    
    for (let i = 1; i <= query.periods; i++) {
      const futureValue = slope * (n + i - 1) + intercept;
      const futureTimestamp = new Date(lastTimestamp.getTime() + i * intervalMs);
      
      const randomVariation = 0.95 + Math.random() * 0.1;
      const adjustedValue = Math.max(0, futureValue * randomVariation);
      
      predictions.push({
        timestamp: futureTimestamp.toISOString(),
        predictedValue: Math.round(adjustedValue * 100) / 100,
        confidence: Math.max(0.5, 1 - (i * 0.05)),
      });
    }

    return reply.send({
      monitoringPointId: id,
      predictionInterval: query.interval,
      periods: query.periods,
      basedOnDataPoints: historicalData.length,
      predictions,
      metadata: {
        algorithm: "Linear Regression",
        slope: Math.round(slope * 1000) / 1000,
        intercept: Math.round(intercept * 1000) / 1000,
        lastActualValue: historicalData[historicalData.length - 1].value,
        firstPredictedValue: predictions[0].predictedValue,
      }
    });
  });
}