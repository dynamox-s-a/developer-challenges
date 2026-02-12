import type { ApiResponse } from '../../types/api.types'

export interface Machine {
  uuid: string
  name: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface MachinesState {
  machines: Machine[]
  selectedMachine: Machine | null
  loading: boolean
  error: string | null
}

export interface CreateMachineInput {
  name: string
  type: string
}

export interface UpdateMachineInput {
  name?: string
  type?: string
}

export type MachinesResponse = ApiResponse<Machine[]>
export type MachineResponse = ApiResponse<Machine>
