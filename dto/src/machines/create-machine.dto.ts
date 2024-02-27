import { z } from 'zod';

export type CreateMachineDto = {
  name: string;
  type: string;
};

export const createMachineDto = z.object({
  name: z.string(),
  type: z.union([
    z.literal('Pump'),
    z.literal('Fan')]
  )
});
