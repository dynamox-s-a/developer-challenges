import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

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

export interface Machine {
  id?: string
  name: string
  type: string
}

export interface MachinesState {
  machines: Machine[]
  status: string
  error: string | undefined
}

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
  }
})

// export const { change } = machinesSlice.actions

export default machinesSlice.reducer
