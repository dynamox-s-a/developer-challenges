import { ORPCError } from '@orpc/server';

import { getMachine, listMachines } from '../../../container';
import { pub } from '../../../core/context';

export const listMachinesRoute = pub.machines.list.handler(async () => ({ data: await listMachines() }));

export const getMachineRoute = pub.machines.get.handler(async ({ input }) => {
  const machine = await getMachine(input.id);

  if (!machine) throw new ORPCError('NOT_FOUND', { message: `Máquina ${input.id} não encontrada` });

  return machine;
});
