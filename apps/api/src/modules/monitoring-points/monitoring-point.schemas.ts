import { z } from 'zod'

export const monitoringPointCreateSchema = z
  .object({
    name: z.string().min(1),
    machineUuid: z.uuid()
  })
  .strict()

export const monitoringPointUpdateSchema = z
  .object({
    name: z.string().min(1).optional()
  })
  .strict()

export const monitoringPointListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(5),
  sortBy: z
    .enum(['machineName', 'machineType', 'name', 'sensorModel', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  machineUuid: z.uuid().optional()
})

export const uuidParamSchema = z.object({
  uuid: z.uuid()
})
