import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string().min(50, 'A descrição deve ter pelo menos 50 caracteres'),
  dateTime: z
    .string()
    .refine((value) => new Date(value) > new Date(), 'A data e hora devem ser maiores que a data e hora atual'),
  location: z.string().min(1, 'O local é obrigatório'),
  category: z.string().min(1, 'A categoria é obrigatória'),
});

export type EventSchema = z.infer<typeof eventSchema>;
