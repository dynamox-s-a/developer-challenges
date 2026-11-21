import { Router, type Request } from 'express';
import { machineSchema } from '@dynapredict/shared';
import { requireAuth } from '../../middlewares/require-auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import {
  createMachine,
  deleteMachine,
  getMachine,
  listMachines,
  updateMachine,
} from './machines.service.ts';

export const machinesRouter = Router();

// Todas as rotas de máquinas exigem login: o porteiro roda antes de cada uma
machinesRouter.use(requireAuth);

machinesRouter.get('/', async (_req, res) => {
  res.json(await listMachines());
});

machinesRouter.get('/:id', async (req, res) => {
  res.json(await getMachine(req.params.id));
});

machinesRouter.post('/', validateBody(machineSchema), async (req, res) => {
  const machine = await createMachine(req.body);
  res.status(201).json(machine); // 201 Created: algo novo foi criado
});

// Com o validateBody no meio, o TypeScript perde o tipo do ":id" da URL.
// O Request<{ id: string }> devolve essa informação para ele
machinesRouter.put(
  '/:id',
  validateBody(machineSchema),
  async (req: Request<{ id: string }>, res) => {
    res.json(await updateMachine(req.params.id, req.body));
  },
);

machinesRouter.delete('/:id', async (req, res) => {
  await deleteMachine(req.params.id);
  res.status(204).end(); // 204 No Content: deu certo e não há nada para devolver
});
