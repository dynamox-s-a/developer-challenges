import type { Request, Response } from 'express';
import type { ListMachinesQuery, MachineInput } from './machines.schemas';
import * as machinesService from './machines.service';

// Params, query and body were already parsed by validate() in the routes.

export async function list(req: Request, res: Response) {
  res.json(
    await machinesService.listMachines(
      req.query as unknown as ListMachinesQuery,
    ),
  );
}

export async function get(req: Request<{ id: string }>, res: Response) {
  res.json(await machinesService.getMachine(req.params.id));
}

export async function create(req: Request, res: Response) {
  const machine = await machinesService.createMachine(req.body as MachineInput);
  res.status(201).json(machine);
}

export async function update(req: Request<{ id: string }>, res: Response) {
  res.json(
    await machinesService.updateMachine(
      req.params.id,
      req.body as MachineInput,
    ),
  );
}

export async function remove(req: Request<{ id: string }>, res: Response) {
  await machinesService.deleteMachine(req.params.id);
  res.status(204).end();
}
