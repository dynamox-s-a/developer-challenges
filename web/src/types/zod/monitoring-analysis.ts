import z from 'zod'
import { MachinePresenterSchema } from './machine'
import { SensorPresenterSchema } from './sensor'
import { createResponseSchema } from '@/utils/createResponse'

export const MonitoringAnalysisPresenterSchema = z.object({
  _id: z.string(),
  Name: z.string().max(20),
  Machine: MachinePresenterSchema,
  Sensor: SensorPresenterSchema.optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
})

export const MonitoringAnalysisResponseSchema = createResponseSchema(
  MonitoringAnalysisPresenterSchema,
)

export const MonitoringAnalysisResponseSchemas = createResponseSchema(
  z.array(MonitoringAnalysisPresenterSchema),
)

export type MonitoringAnalysisResponses = z.infer<
  typeof MonitoringAnalysisResponseSchemas
>

export type MonitoringAnalysisResponse = z.infer<
  typeof MonitoringAnalysisResponseSchema
>

export type MonitoringAnalysisPresenter = z.infer<
  typeof MonitoringAnalysisPresenterSchema
>
