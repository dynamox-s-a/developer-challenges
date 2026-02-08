import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { createMonitoringPointSchema, updateMonitoringPointSchema } from "../schemas/monitoringPoint.js";

const paramsSchema = z.object({
  machineId: z.string().min(1),
  id: z.string().min(1),
});

const listQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).default(5),
  skip: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(["machineName", "machineType", "monitoringPointName", "sensorModel", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const forbiddenForPump = new Set(["TcAg", "TcAs"]);

function mapSort(sortBy: string, sortOrder: "asc" | "desc") {
  const order = sortOrder ?? "asc";
  switch (sortBy) {
    case "machineName":
      return { machine: { name: order } } as const;
    case "machineType":
      return { machine: { type: order } } as const;
    case "monitoringPointName":
      return { name: order } as const;
    case "sensorModel":
      return { sensor: { model: order } } as const;
    case "createdAt":
    default:
      return { createdAt: order } as const;
  }
}

export async function monitoringPointsRoutes(app: FastifyInstance) {
  // Create monitoring point for a machine (with sensor)
  app.post("/machines/:machineId/monitoring-points", async (req, reply) => {
    const { machineId } = paramsSchema.parse(req.params);
    const body = createMonitoringPointSchema.parse(req.body);

    const machine = await prisma.machine.findUnique({ where: { id: machineId } });
    if (!machine) return reply.notFound("Machine not found");

    if (machine.type === "Pump" && forbiddenForPump.has(body.sensor.model)) {
      return reply.badRequest("Sensors TcAg and TcAs are not allowed for Pump machines");
    }

    const created = await prisma.monitoringPoint.create({
      data: {
        name: body.name,
        machineId,
        sensor: {
          create: {
            uniqueId: body.sensor.uniqueId,
            model: body.sensor.model,
          },
        },
      },
      include: { machine: true, sensor: true },
    });

    return reply.code(201).send(created);
  });

  // List monitoring points with pagination + sorting (for the table)
  app.get("/monitoring-points", async (req) => {
    const query = listQuerySchema.parse(req.query);

    const { take, skip, sortBy, sortOrder } = query;

    const orderBy = (() => {
      switch (sortBy) {
        case "machineName":
          return { machine: { name: sortOrder } } as const;
        case "machineType":
          return { machine: { type: sortOrder } } as const;
        case "monitoringPointName":
          return { name: sortOrder } as const;
        case "sensorModel":
          return { sensor: { model: sortOrder } } as const;
        case "createdAt":
          return { createdAt: sortOrder } as const;
        default:
          return { machine: { name: "asc" } } as const;
      }
    })();

    const [items, total] = await Promise.all([
      prisma.monitoringPoint.findMany({
        skip,
        take,
        orderBy,
        include: { machine: true, sensor: true },
      }),
      prisma.monitoringPoint.count(),
    ]);

    return {
      items: items.map((mp) => ({
        id: mp.id,
        monitoringPointName: mp.name,
        machineName: mp.machine.name,
        machineType: mp.machine.type,
        sensorModel: mp.sensor?.model ?? null,
        sensorUniqueId: mp.sensor?.uniqueId ?? null,
        createdAt: mp.createdAt,
      })),
      total,
      take,
      skip,
      sortBy,
      sortOrder,
    };
  });

  app.patch("/monitoring-points/:id", async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    const body = updateMonitoringPointSchema.parse(req.body);

    const current = await prisma.monitoringPoint.findUnique({
      where: { id },
      include: { machine: true, sensor: true },
    });
    if (!current) return reply.notFound("Monitoring point not found");

    const nextSensorModel = body.sensor?.model ?? current.sensor?.model ?? null;
    if (current.machine.type === "Pump" && nextSensorModel && forbiddenForPump.has(nextSensorModel)) {
      return reply.badRequest("Sensors TcAg and TcAs are not allowed for Pump machines");
    }

    const updated = await prisma.monitoringPoint.update({
      where: { id },
      data: {
        name: body.name,
        sensor: body.sensor
          ? current.sensor
            ? {
                update: {
                  uniqueId: body.sensor.uniqueId,
                  model: body.sensor.model,
                },
              }
            : {
                create: {
                  uniqueId: body.sensor.uniqueId ?? crypto.randomUUID(),
                  model: body.sensor.model ?? "HF_plus",
                },
              }
          : undefined,
      },
      include: { machine: true, sensor: true },
    });

    return reply.send(updated);
  });

  app.delete("/monitoring-points/:id", async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    await prisma.monitoringPoint.delete({ where: { id } });
    return reply.code(204).send();
  });
}