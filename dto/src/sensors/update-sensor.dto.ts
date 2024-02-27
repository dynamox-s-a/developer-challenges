import { z } from 'zod';

export type UpdateSensorDto = {
  model: string;
};

export const updateSensorDto = z.object({
  model: z.union([
    z.literal('TcAg'),
    z.literal('TcAs'),
    z.literal('HF+'),
  ]),
});
