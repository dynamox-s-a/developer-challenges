import { oc } from '@orpc/contract';

import { measurementsQuerySchema, measurementsSchema } from './schema';

const tag = oc.route({ tags: ['Measurements'] });

export const measurements = oc.prefix('/machines').router({
  list: tag
    .route({
      method: 'GET',
      path: '/{machineId}/measurements',
      summary: 'Séries temporais de aceleração, velocidade e temperatura de uma máquina',
    })
    .input(measurementsQuerySchema)
    .output(measurementsSchema),
});
