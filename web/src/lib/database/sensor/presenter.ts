import type { IMachine } from '../machine/schema'
import type { ISensor } from './schema'

export type ISensorResponse = {
  success: boolean
  data?: ISensor | ISensor[] | IMachine
  message: string
}

export function SensorResponse(
  success: boolean,
  message: string,
  data?: ISensor | ISensor[] | IMachine,
): ISensorResponse {
  return {
    success: success,
    data: data,
    message: message,
  }
}
