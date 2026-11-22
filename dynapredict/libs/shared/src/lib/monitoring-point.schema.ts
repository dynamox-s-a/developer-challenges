import { z } from 'zod';

// A máquina do ponto vem na URL (/machines/:machineId/monitoring-points),
// por isso o corpo só tem o nome
export const monitoringPointSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do ponto')
    .max(100, 'Use no máximo 100 caracteres'),
});

export type MonitoringPointInput = z.infer<typeof monitoringPointSchema>;
