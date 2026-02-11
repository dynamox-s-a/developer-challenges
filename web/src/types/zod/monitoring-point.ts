import { createResponseSchema } from '@/utils/createResponse'
import z from 'zod'

export const CreateMonitoringPointSchema = z.object({
  name: z.string().max(20),
  sensor: z.string().optional(),
  machine: z.string(),
})

export const MonitoringPointPresenterSchema = z.object({
  _id: z.string(),
  Name: z.string().max(20),
  Machine: z.string(),
  Sensor: z.string().optional(),
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
export type MonitoringPointResponse = z.infer<typeof MonitoringPointResponseSchema>
