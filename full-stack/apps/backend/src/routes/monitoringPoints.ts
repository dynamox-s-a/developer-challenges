import { FastifyInstance } from "fastify";
import { prisma } from "../prisma.js";
import { createMonitoringPointSchema, updateMonitoringPointSchema } from "../schemas/monitoringPoint.js";

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
    const machineId = (req.params as any).machineId as string;
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
    const q = req.query as any;

    const take = Math.min(Math.max(parseInt(q.take ?? "5", 10), 1), 50);
    const skip = Math.max(parseInt(q.skip ?? "0", 10), 0);
    const sortBy = (q.sortBy ?? "createdAt") as string;
    const sortOrder = ((q.sortOrder ?? "asc") as string).toLowerCase() === "desc" ? "desc" : "asc";

    const orderBy = mapSort(sortBy, sortOrder);

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

  // Update MP (+ optional sensor)
  app.patch("/monitoring-points/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
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
    const id = (req.params as any).id as string;
    await prisma.monitoringPoint.delete({ where: { id } });
    return reply.code(204).send();
  });
}