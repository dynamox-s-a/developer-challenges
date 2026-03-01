import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type {
  CreateMachineRequest,
  MachinesListResponse,
  PatchMachineRequest,
} from '@dynamox/types'
import type { BaseState } from '../../types'
import { machinesAPI } from '../../../api/machines'
import { extractErrorMessage } from '../../../utils/form-errors'

type MachineListItem = MachinesListResponse['machines'][number]

export interface MachinesState extends BaseState {
  machines: MachineListItem[]
}

const initialState: MachinesState = {
  isLoading: false,
  error: null,
  machines: [],
}

export const fetchMachines = createAsyncThunk(
  'machines/fetchMachines',
  async () => {
    const response = await machinesAPI.getMachines()
    return response.data
  }
)

export const createMachine = createAsyncThunk(
  'machines/createMachine',
  async (data: CreateMachineRequest, { rejectWithValue }) => {
    try {
      const response = await machinesAPI.createMachine(data)
      return response.data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao criar máquina'))
    }
  }
)

export const updateMachine = createAsyncThunk(
  'machines/updateMachine',
  async ({ uuid, data }: { uuid: string; data: PatchMachineRequest }, { rejectWithValue }) => {
    try {
      const response = await machinesAPI.updateMachine(uuid, data)
      return response.data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao atualizar máquina'))
    }
  }
)

export const deleteMachine = createAsyncThunk(
  'machines/deleteMachine',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await machinesAPI.deleteMachine(uuid)
      return uuid
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao remover máquina'))
    }
  }
)

export const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMachines.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.isLoading = false
        state.machines = action.payload.machines
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Erro ao carregar máquinas'
      })

    builder
      .addCase(createMachine.fulfilled, (state, action) => {
        state.machines.push(action.payload)
      })

    builder
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.machines.findIndex(machine => machine.uuid === action.payload.uuid)
        if (index !== -1) {
          state.machines[index] = { ...state.machines[index], ...action.payload }
        }
      })

    builder
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.machines = state.machines.filter(machine => machine.uuid !== action.payload)
      })
  }
})

export default machinesSlice.reducer
