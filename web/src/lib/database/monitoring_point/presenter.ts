import z from 'zod'
import { type MonitoringPointDTO, MonitoringPointModel } from './schema'

export const MonitoringResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .union([MonitoringPointModel, z.array(MonitoringPointModel)])
    .optional(),
  message: z.string(),
})

export type IMonitoringResponse = z.infer<typeof MonitoringResponseSchema>

export function MonitoringPointResponse(
  success: boolean,
  message: string,
  data?: MonitoringPointDTO | MonitoringPointDTO[],
): IMonitoringResponse {
  return {
    success: success,
    data: data,
    message: message,
  }
}
