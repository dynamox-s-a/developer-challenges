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
  scope: {
    aceleration: string;
    velocity: string;
    temperature: string;
  }
}

const initialState: MeasuresState = {
  data: [],
  isLoading: false,
  scope: {
    aceleration: 'lastWeek',
    velocity: 'lastWeek',
    temperature: 'lastWeek'
  }
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
    },
    setScope: (state, action) => {
      const { type, selectScope } = action.payload

      if(type === 'aceleration') {
        state.scope.aceleration = selectScope
      }

      if(type === 'velocity') {
        state.scope.velocity = selectScope
      }

      if(type === 'temperature') {
        state.scope.temperature = selectScope
      }

      if(type === 'responsiveChange') {
        state.scope.aceleration = selectScope
        state.scope.velocity = selectScope
        state.scope.temperature = selectScope
      }

      
    }
  },
})

// exportar minhas actions para o projeto
export const { getMeasuresFetch, getMeasuresSuccess, getMeasuresFailiure, setScope } = measuresSlice.actions
// exportar meu reducer para a store:
export default measuresSlice.reducer