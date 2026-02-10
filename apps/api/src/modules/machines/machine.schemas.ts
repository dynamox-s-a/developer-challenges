import { z } from 'zod'

export const machineCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['Pump', 'Fan'])
})

export const machineUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['Pump', 'Fan']).optional()
})

export const uuidParamSchema = z.object({
  uuid: z.uuid()
})
