import { createSlice } from '@reduxjs/toolkit'

import { SeriesData } from '../types/charts'


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
    reducers: {},
})

export default chartsSlice.reducer
