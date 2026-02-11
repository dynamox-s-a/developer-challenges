import { z } from 'zod'

export const machineCreateSchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(['Pump', 'Fan'])
  })
  .strict()

export const machineUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    type: z.enum(['Pump', 'Fan']).optional()
  })
  .strict()

export const uuidParamSchema = z.object({
  uuid: z.uuid()
})
