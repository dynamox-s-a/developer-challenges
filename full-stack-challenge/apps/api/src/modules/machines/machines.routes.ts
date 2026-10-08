import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import * as machinesController from './machines.controller';
import {
  listMachinesQuery,
  machineIdParams,
  machineInputSchema,
} from './machines.schemas';

export const machinesRoutes = Router();

machinesRoutes.get(
  '/',
  validate(listMachinesQuery, 'query'),
  machinesController.list,
);
machinesRoutes.get(
  '/:id',
  validate(machineIdParams, 'params'),
  machinesController.get,
);
machinesRoutes.post(
  '/',
  validate(machineInputSchema),
  machinesController.create,
);
machinesRoutes.put(
  '/:id',
  validate(machineIdParams, 'params'),
  validate(machineInputSchema),
  machinesController.update,
);
machinesRoutes.delete(
  '/:id',
  validate(machineIdParams, 'params'),
  machinesController.remove,
);
