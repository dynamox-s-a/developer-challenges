import { MACHINE_SORT_FIELDS, MachineType } from '@dynapredict/shared-types';
import { z } from 'zod';
import { paginationQuery } from '../../lib/pagination';

export const machineIdParams = z.object({ id: z.uuid() });

export const machineInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.enum(MachineType),
});

export const listMachinesQuery = paginationQuery(10).extend({
  sortBy: z.enum(MACHINE_SORT_FIELDS).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export type MachineInput = z.infer<typeof machineInputSchema>;
export type ListMachinesQuery = z.infer<typeof listMachinesQuery>;
