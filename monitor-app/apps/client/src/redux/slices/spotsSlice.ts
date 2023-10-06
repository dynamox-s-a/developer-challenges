import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { type Spot } from 'types/spot'

export interface SpotsState {
  spots: Spot[]
  spot: Spot
  status: string
  error: string | undefined
}

type FetchErrorResponseProps = {
  message: string
}

export const getSpots = createAsyncThunk('spots/getSpots', async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/spot')
  if (!response.ok) {
    const apiError: FetchErrorResponseProps = await response.json()
    const { message } = apiError
    throw new Error(`${message}`)
  }
  const spots = response.json()
  return spots
})

export const getSpotById = createAsyncThunk('spots/getSpotById', async (id: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/spot/' + id)
  if (!response.ok) {
    const apiError: FetchErrorResponseProps = await response.json()
    const { message } = apiError
    throw new Error(`${message}`)
  }
  const spot = response.json()
  return spot
})

export const createSpot = createAsyncThunk(
  'spots/createSpot',
  async ({ name, machineId, sensorId, sensorModel }: Spot) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, machineId, sensorId, sensorModel })
    }
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/spot', options)
    if (!response.ok) {
      const apiError: FetchErrorResponseProps = await response.json()
      const { message } = apiError
      throw new Error(`${message}`)
    }
    const spot = response.json()
    return spot
  }
)

export const updateSpot = createAsyncThunk(
  'spots/updateSpot',
  async ({ id, name, machineId, sensorId, sensorModel }: Spot) => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, name, machineId, sensorId, sensorModel })
    }
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/spot/' + id, options)
    if (!response.ok) {
      const apiError: FetchErrorResponseProps = await response.json()
      const { message } = apiError
      throw new Error(`${message}`)
    }
    const spot = response.json()
    return spot
  }
)

export const deleteSpot = createAsyncThunk('spots/deleteSpot', async (id: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/spot/' + id, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const apiError: FetchErrorResponseProps = await response.json()
    const { message } = apiError
    throw new Error(`${message}`)
  }
  return response.status
})

const initialState: SpotsState = {
  spots: [],
  spot: { id: '', name: '', machineId: '', sensorId: '', sensorModel: '' },
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined
}

export const spotsSlice = createSlice({
  name: 'spots',
  initialState,
  reducers: {
    resetError(state, action) {
      state.error = undefined
      state.status = 'succeeded'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpots.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getSpots.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.spots = action.payload
      })
      .addCase(getSpots.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(getSpotById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getSpotById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.spot = action.payload
      })
      .addCase(getSpotById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createSpot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createSpot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.spots.push(action.payload)
      })
      .addCase(createSpot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(updateSpot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateSpot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.spots = state.spots.map((spot) =>
          spot.id === action.payload.id ? (spot = action.payload) : spot
        )
        state.spot = initialState.spot
      })
      .addCase(updateSpot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(deleteSpot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteSpot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.spots = state.spots.filter((spot) => spot.id !== action.meta.arg)
        state.spot = initialState.spot
      })
      .addCase(deleteSpot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { resetError } = spotsSlice.actions

export default spotsSlice.reducer
