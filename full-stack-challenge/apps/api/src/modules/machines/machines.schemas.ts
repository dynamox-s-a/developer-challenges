import { MachineType } from '@prisma/client';
import { z } from 'zod';

export const createMachineSchema = z.object({
  name: z.string().trim().min(1).max(120),
  type: z.nativeEnum(MachineType),
});

export const updateMachineSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    type: z.nativeEnum(MachineType).optional(),
  })
  .refine((data) => data.name !== undefined || data.type !== undefined, {
    message: 'At least one field (name or type) must be provided',
  });

export type CreateMachineInput = z.infer<typeof createMachineSchema>;
export type UpdateMachineInput = z.infer<typeof updateMachineSchema>;
