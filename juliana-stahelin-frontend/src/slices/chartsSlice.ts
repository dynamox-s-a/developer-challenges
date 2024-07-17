import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SeriesData } from '@/types/charts'


export interface ChartsState {
    data: SeriesData[] | null
    error: string | null
    isLoading: boolean
}

const initialState: ChartsState = {
    data: null,
    error: null,
    isLoading: false
}

export const chartsSlice = createSlice({
    name: 'charts',
    initialState,
    reducers: {
        getChartsFetch: (state) => {
            state.isLoading = true
        },
        getChartsSuccess: (state, action: PayloadAction<SeriesData[]>) => {
            state.data = action.payload
            state.error = null
            state.isLoading = false
        },
        getChartsFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.isLoading = false
        }
    },
})

export const { getChartsFetch, getChartsSuccess, getChartsFailure } = chartsSlice.actions
export default chartsSlice.reducer
