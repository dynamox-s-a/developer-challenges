import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { DashboardMetrics } from '@dynamox/types'
import { reportsAPI } from '../../../api/reports'
import type { BaseState } from '../../types'

export interface ReportsState extends BaseState {
  metrics: DashboardMetrics | null
}

const initialState: ReportsState = {
  isLoading: false,
  error: null,
  metrics: null,
}

export const fetchDashboardMetrics = createAsyncThunk(
  'reports/fetchDashboardMetrics',
  async () => {
    const response = await reportsAPI.getDashboardMetrics()
    return response.data
  }
)

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardMetrics.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false
        state.metrics = action.payload
      })
      .addCase(fetchDashboardMetrics.rejected, (state) => {
        state.isLoading = false
        state.error = 'Erro inesperado ao carregar métricas. Por favor, tente novamente mais tarde.'
      })
  }
})

export default reportsSlice.reducer
