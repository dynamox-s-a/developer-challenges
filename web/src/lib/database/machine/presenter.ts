import type { IMachine } from './schema'

export type IMachineResponse = {
  success: boolean
  data?: IMachine
  message: string
}

export function MachineResponse(
  success: boolean,
  message: string,
  data?: IMachine,
): IMachineResponse {
  return {
    success: success,
    data: data,
    message: message,
  }
}
