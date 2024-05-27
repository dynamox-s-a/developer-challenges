// store + slices + createAsyncThunk

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface MachineData {
  name: string
  data: Array<{
    datetime: string
    max: number
  }>
}

interface MachineDataState {
  data: MachineData[]
  isLoading: boolean
}

const initialState: MachineDataState = {
  data: [],
  isLoading: true
}

// action asyncrona do Redux
export const loadMachineData = createAsyncThunk(
  'machineData/load',
  async () => {
    const response = await api.get('/data')
    return response.data
  }
)

export const machineData = createSlice({
  name: 'machineData',
  initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder.addCase(loadMachineData.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(loadMachineData.fulfilled, (state, action) => {
      state.data = action.payload
      state.isLoading = false
    })
  }
})

export const store = configureStore({
  reducer: {
    machineData: machineData.reducer
  }
})

// useAppSelector = useSelector+Typescript
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// useAppDispatch = useDispatch+Typescript
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch


// o ideal é fazer o load da minha action, dentro do meu reducers direto através de uma action. Porém não consigo usar uma função asíncrone diretamente dentro do meu reducers: { start: async()... }
// extraReducer -> função que recebe um builder como arg... 1º Parametro: loadMachinda.fulfilled data for fulfilled... 2º Parametro é o que queremos executar se meu loadMachine for fulfilled