import type { ApiResponse } from '../../types/api.types'

export interface Machine {
  uuid: string
  name: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface MachinesState {
  items: Machine[]
  selected: Machine | null
  status: {
    fetch: {
      loading: boolean
      error: string | null
    }
    create: {
      loading: boolean
      error: string | null
    }
    update: {
      loading: boolean
      error: string | null
    }
    remove: {
      loading: boolean
      error: string | null
    }
  }
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
