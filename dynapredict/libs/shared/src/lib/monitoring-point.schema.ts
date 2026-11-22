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

// As colunas da lista de pontos que podem ser usadas para ordenar
export const monitoringPointSortFieldSchema = z.enum(
  ['machineName', 'machineType', 'pointName', 'sensorModel'],
  'Coluna de ordenação inválida',
);
export type MonitoringPointSortField = z.infer<
  typeof monitoringPointSortFieldSchema
>;

export const sortOrderSchema = z.enum(
  ['asc', 'desc'],
  'Direção de ordenação inválida',
);
export type SortOrder = z.infer<typeof sortOrderSchema>;

// Número inteiro a partir de 1. Na URL tudo chega como texto ("?page=2"),
// por isso o coerce: ele converte o texto em número antes de validar
function positiveInt(message: string) {
  return z.coerce.number(message).int(message).min(1, message);
}

// Os parâmetros da lista de pontos, ex.: ?page=2&sortBy=machineName&order=desc.
// O que não vier na URL fica com o valor padrão
export const monitoringPointListQuerySchema = z.object({
  page: positiveInt('Página inválida').default(1),
  pageSize: positiveInt('Tamanho de página inválido')
    .max(50, 'Use no máximo 50 itens por página')
    .default(5),
  sortBy: monitoringPointSortFieldSchema.default('machineName'),
  order: sortOrderSchema.default('asc'),
});

export type MonitoringPointListQuery = z.infer<
  typeof monitoringPointListQuerySchema
>;
