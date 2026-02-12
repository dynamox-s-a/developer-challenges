import { z } from 'zod'

export const uuidParamSchema = z.object({
  uuid: z.uuid()
})

const pointSchema = z.object({
  timestamp: z.coerce.date(),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  temperature: z.number()
})

export const timeSeriesCreateSchema = z
  .object({
    intervalMinutes: z.number().int().min(1).max(60).optional(),
    points: z.array(pointSchema).min(1).max(5000)
  })
  .strict()

export const timeSeriesListQuerySchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    limit: z.coerce.number().int().min(1).max(10000).default(1000),
    order: z.enum(['asc', 'desc']).default('desc')
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be less than or equal to `to`'
  })

export const timeSeriesMetricsQuerySchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional()
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be less than or equal to `to`'
  })

export const timeSeriesDeleteQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  all: z.coerce.boolean().optional()
})
