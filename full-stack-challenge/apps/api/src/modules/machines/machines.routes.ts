import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../shared/validate';
import { createMachineSchema, updateMachineSchema } from './machines.schemas';
import * as machinesService from './machines.service';

export const machinesRouter = Router();

machinesRouter.use(requireAuth);

machinesRouter.get('/', async (_req, res, next) => {
  try {
    const machines = await machinesService.listMachines();
    res.json(machines);
  } catch (error) {
    next(error);
  }
});

machinesRouter.get('/:id', async (req, res, next) => {
  try {
    const machine = await machinesService.getMachine(req.params.id);
    res.json(machine);
  } catch (error) {
    next(error);
  }
});

machinesRouter.post('/', validateBody(createMachineSchema), async (req, res, next) => {
  try {
    const machine = await machinesService.createMachine(req.body);
    res.status(201).json(machine);
  } catch (error) {
    next(error);
  }
});

machinesRouter.patch('/:id', validateBody(updateMachineSchema), async (req, res, next) => {
  try {
    const machine = await machinesService.updateMachine(req.params.id, req.body);
    res.json(machine);
  } catch (error) {
    next(error);
  }
});

machinesRouter.delete('/:id', async (req, res, next) => {
  try {
    await machinesService.deleteMachine(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
