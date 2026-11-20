import { z } from 'zod';

export const machineTypeSchema = z.enum(
  ['Pump', 'Fan'],
  'Tipo de máquina inválido',
);
export type MachineType = z.infer<typeof machineTypeSchema>;
export const MACHINE_TYPES = machineTypeSchema.options; // ['Pump', 'Fan']

export const machineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome da máquina')
    .max(100, 'Use no máximo 100 caracteres'),
  type: machineTypeSchema,
});

export type MachineInput = z.infer<typeof machineSchema>;
