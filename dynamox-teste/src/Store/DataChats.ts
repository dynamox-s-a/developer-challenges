import { createSlice } from '@reduxjs/toolkit'


export interface CounterState {
  velocity: {x:[], y:[], z:[]},
  temperature: {y:[]},
  acceleration: {x:[], y:[]},
}

const initialState: CounterState = {
  velocity: {x:[], y:[], z:[]},
  temperature: {y:[]},
  acceleration: {x:[], y:[]},
}

export const DataCharts = createSlice({
    name: 'DataChart',
    initialState,
    reducers: {
        attData: (state, newData) => {
          state.velocity = newData.payload.velocity
          state.temperature = newData.payload.temperature
          state.acceleration = newData.payload.acceleration
        }
    }
})

// Action creators are generated for each case reducer function
export const { attData} = DataCharts.actions

export default DataCharts.reducer