import { z } from 'zod';

export type CreateSensorDto = {
  model: string;
};

export const createSensorDto = z.object({
  model: z.union([
    z.literal('TcAg'),
    z.literal('TcAs'),
    z.literal('HF+'),
  ]),
});
