import type { RequestHandler } from "express";
import { MachinesController } from "./machines.controller";
import type { MachinesRepository } from "./machines.repository";
import { createMachinesRouter } from "./machines.routes";
import { MachinesService } from "./machines.service";

export function createMachinesModule(
  repository: MachinesRepository,
  authenticate: RequestHandler,
) {
  const service = new MachinesService(repository);
  const controller = new MachinesController(service);

  return { router: createMachinesRouter(controller, authenticate) };
}
