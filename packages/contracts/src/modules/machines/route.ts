import { oc } from '@orpc/contract';
import { z } from 'zod';

import { machineSchema, machinesListSchema } from './schema';

const tag = oc.route({ tags: ['Machines'] });

export const machines = oc.prefix('/machines').router({
  list: tag
    .route({ method: 'GET', path: '/', summary: 'Lista as máquinas monitoradas' })
    .output(machinesListSchema),

  get: tag
    .route({ method: 'GET', path: '/{id}', summary: 'Detalha uma máquina' })
    .input(z.object({ id: z.string() }))
    .output(machineSchema),
});
