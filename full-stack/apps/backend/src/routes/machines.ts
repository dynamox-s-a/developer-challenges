import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { createMachineSchema, updateMachineSchema } from "../schemas/machine.js";

const paramsSchema = z.object({
  id: z.string().min(1),
});

export async function machinesRoutes(app: FastifyInstance) {
  app.get("/machines", async () => {
    return prisma.machine.findMany({
      orderBy: { createdAt: "desc" },
      include: { monitoringPoints: { include: { sensor: true } } },
    });
  });

  app.post(
    "/machines",
    {
      schema: {
        tags: ["Machines"],
        summary: "Create a machine",
        body: {
          type: "object",
          required: ["name", "type"],
          properties: {
            name: { type: "string" },
            type: { type: "string", enum: ["Pump", "Fan"] },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              type: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const body = createMachineSchema.parse(req.body);
      const machine = await prisma.machine.create({ data: body });
      return reply.code(201).send(machine);
    }
  );

  app.patch("/machines/:id", async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);
    const body = updateMachineSchema.parse(req.body);

    const updated = await prisma.machine.update({
      where: { id },
      data: body,
    });

    return reply.send(updated);
  });

  app.delete("/machines/:id", async (req, reply) => {
    const { id } = paramsSchema.parse(req.params);

    await prisma.machine.delete({ where: { id } });
    return reply.code(204).send();
  });
}