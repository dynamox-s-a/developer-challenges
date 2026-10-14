import type { Request, Response } from "express";
import {
  createMachineSchema,
  updateMachineSchema,
} from "@full-stack-solution/shared";
import { getIdParam } from "../../shared/http/request";
import { getUserId } from "../auth/auth.middleware";
import type { MachinesService } from "./machines.service";

export class MachinesController {
  constructor(private readonly service: MachinesService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.list(getUserId(req)));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    // The schema drops unknown keys, so a client can never set createdById.
    const input = createMachineSchema.parse(req.body);
    res.status(201).json(await this.service.create(getUserId(req), input));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const input = updateMachineSchema.parse(req.body);
    res.json(await this.service.update(getIdParam(req), getUserId(req), input));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(getIdParam(req), getUserId(req));
    res.status(204).end();
  };
}
