import { createResponseSchema } from '@/utils/createResponse'
import * as z from 'zod'

export const CreateMonitoringPointSchema = z.object({
  Name: z.string().max(20),
  Sensor: z.string().optional(),
  Machine: z.string(),
})

export const MonitoringPointPresenterSchema = z.object({
  _id: z.string(),
  Name: z.string().max(20),
  Machine: z.string(),
  Sensor: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const MonitoringPointResponseSchema = createResponseSchema(
  MonitoringPointPresenterSchema,
)

export type CreateMonitoringPointDto = z.infer<
  typeof CreateMonitoringPointSchema
>

export type MonitoringPointPresenter = z.infer<
  typeof MonitoringPointPresenterSchema
>

export type UpdateMonitoringPointDto = Partial<CreateMonitoringPointDto>
export type MonitoringPointResponse = z.infer<
  typeof MonitoringPointResponseSchema
>
