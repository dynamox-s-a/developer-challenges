import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Machine } from 'types/machine'

export interface MachinesState {
  machines: Machine[]
  status: string
  error: string | undefined
}

type FetchErrorResponseProps = {
  message: string
}

export const getMachines = createAsyncThunk('machines/getMachines', async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/machine')
  if (!response.ok) {
    const apiError: FetchErrorResponseProps = await response.json()
    const { message } = apiError
    throw new Error(`${message}`)
  }
  const machines = response.json()
  return machines
})

export const createMachine = createAsyncThunk(
  'machines/createMachine',
  async ({ name, type }: Machine) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, type })
    }
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/machine', options)
    if (!response.ok) {
      const apiError: FetchErrorResponseProps = await response.json()
      const { message } = apiError
      throw new Error(`${message}`)
    }
    const machine = response.json()
    return machine
  }
)

const initialState: MachinesState = {
  machines: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined
}

export const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    //
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMachines.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getMachines.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.machines = action.payload
      })
      .addCase(getMachines.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createMachine.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.machines.push(action.payload)
      })
      .addCase(createMachine.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

// export const { change } = machinesSlice.actions

export default machinesSlice.reducer
