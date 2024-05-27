import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Measures {
  name: string
  data: Array<{
    datetime: string
    max: number
  }>
}

interface MeasuresState {
  data: Measures[]
  isLoading: boolean
}

const initialState: MeasuresState = {
  data: [],
  isLoading: false
}

export const measuresSlice = createSlice({
  name: 'measuresSlice',
  initialState,
  reducers: {
    getMeasuresFetch: (state) => {
      state.isLoading = true
    },
    getMeasuresSuccess: (state, action: PayloadAction<Measures[]>) => {
      state.data = action.payload
      state.isLoading = false
    },
    getMeasuresFailiure: (state) => {
      state.isLoading = false
    }
  },
})

// exportar minhas actions para o projeto
export const { getMeasuresFetch, getMeasuresSuccess, getMeasuresFailiure } = measuresSlice.actions
// exportar meu reducer para a store:
export default measuresSlice.reducer