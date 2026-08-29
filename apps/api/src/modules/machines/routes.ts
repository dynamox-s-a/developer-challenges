import { createMachineRequestSchema, idSchema, updateMachineRequestSchema } from "@dyn/contracts";
import { Hono } from "hono";

import type { AppEnv } from "../../shared/context.js";
import { parseWithSchema, validated } from "../../shared/http.js";
import type { MachineService } from "./service.js";

export function createMachineRoutes(service: MachineService) {
  return new Hono<AppEnv>()
    .get("/api/v1/machines", async (c) => {
      const machines = await service.list();
      return c.json(machines);
    })
    .post("/api/v1/machines", validated("json", createMachineRequestSchema), async (c) => {
      const input = c.req.valid("json");
      const machine = await service.create(input);
      return c.json(machine, 201);
    })
    .get("/api/v1/machines/:machineId", async (c) => {
      const id = parseWithSchema(idSchema, c.req.param("machineId"));
      const machine = await service.get(id);
      return c.json(machine);
    })
    .patch(
      "/api/v1/machines/:machineId",
      validated("json", updateMachineRequestSchema),
      async (c) => {
        const id = parseWithSchema(idSchema, c.req.param("machineId"));
        const input = c.req.valid("json");
        const machine = await service.update(id, input);
        return c.json(machine);
      }
    )
    .delete("/api/v1/machines/:machineId", async (c) => {
      const id = parseWithSchema(idSchema, c.req.param("machineId"));
      await service.delete(id);
      return c.body(null, 204);
    });
}
