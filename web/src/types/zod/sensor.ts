// import mongoose from 'mongoose'

import { createResponseSchema } from '@/utils/createResponse'
import z from 'zod'

export const SensorTypeSchema = z.enum(['TcAs', 'HF+', 'TcAg'])

export const CreateSensorSchema = z.object({
  Code: z.string(),
  Model: SensorTypeSchema,
  Machine: z.string(),
})

export const SensorPresenterSchema = z.object({
  _id: z.string(),
  Code: z.string(),
  Model: SensorTypeSchema,
  Machine: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const SensorResponseSchema = createResponseSchema(SensorPresenterSchema)

export type SensorType = z.infer<typeof SensorTypeSchema>
export type CreateSensorDto = z.infer<typeof CreateSensorSchema>
export type UpdateSensorDto = Partial<CreateSensorDto>
export type SensorResponse = z.infer<typeof SensorResponseSchema>
export type SensorPresenter = z.infer<typeof SensorPresenterSchema>
