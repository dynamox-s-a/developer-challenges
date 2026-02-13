import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  TimeSeriesDataPoint,
  TimeSeriesMetrics,
  TimeSeriesPaginatedResponse,
} from '@/types/zod/timeSeries'

interface TimeSeriesState {
  data: TimeSeriesDataPoint[]
  totalCount: number
  currentPage: number
  pageSize: number
  loading: boolean
  error: string | null
  metrics: Record<string, TimeSeriesMetrics>
}

const initialState: TimeSeriesState = {
  data: [],
  totalCount: 0,
  currentPage: 0,
  pageSize: 50,
  loading: false,
  error: null,
  metrics: {},
}

const timeSeriesSlice = createSlice({
  name: 'timeSeries',
  initialState,
  reducers: {
    setTimeSeriesData: (
      state,
      action: PayloadAction<TimeSeriesPaginatedResponse>,
    ) => {
      state.data = action.payload.data
      state.totalCount = action.payload.total
      state.currentPage = action.payload.page
      state.pageSize = action.payload.pageSize
      state.error = null
    },

    setMetrics: (state, action: PayloadAction<TimeSeriesMetrics>) => {
      state.metrics[action.payload.monitoringPointId] = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    addTimeSeriesPoints: (
      state,
      action: PayloadAction<TimeSeriesDataPoint | TimeSeriesDataPoint[]>,
    ) => {
      const newPoints = Array.isArray(action.payload)
        ? action.payload
        : [action.payload]
      state.data = [...newPoints, ...state.data]
      state.totalCount += newPoints.length
    },

    removeTimeSeriesPoint: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(p => p._id !== action.payload)
      state.totalCount -= 1
    },

    removeAllTimeSeriesPoints: state => {
      state.data = []
      state.totalCount = 0
    },

    clearTimeSeriesState: () => initialState,
  },
})

export const {
  setTimeSeriesData,
  setMetrics,
  setLoading,
  setError,
  addTimeSeriesPoints,
  removeTimeSeriesPoint,
  removeAllTimeSeriesPoints,
  clearTimeSeriesState,
} = timeSeriesSlice.actions

export default timeSeriesSlice.reducer
