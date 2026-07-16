import { ORPCError } from '@orpc/server';

import { getMachineMeasurements } from '../../../container';
import { pub } from '../../../core/context';

export const listMeasurementsRoute = pub.measurements.list.handler(async ({ input }) => {
  const measurements = await getMachineMeasurements(input);

  if (!measurements) {
    throw new ORPCError('NOT_FOUND', { message: `Máquina ${input.machineId} não encontrada` });
  }

  return measurements;
});
