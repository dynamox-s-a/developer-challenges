import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Repositorios from '../services/dados';
import { RootState } from './configure-store';

// Definição da interface para o estado do sensor
interface SensorState {
  data: any[];
  cursorPosition: number | null;
}

// Estado inicial do sensor
const initialState: SensorState = {
  data: [],
  cursorPosition: null,
};

/**
 * Função assíncrona para buscar dados de outro sensor.
 * Utiliza a função Repositorios() para obter os dados.
 */
export const fetchAnotherSensorData = createAsyncThunk('anotherSensor/fetchAnotherSensorData', async () => {
  const response = await Repositorios();
  return response;
});

// Criação do slice do sensor utilizando createSlice do Redux Toolkit
const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {
      setCursorPosition: (state: any, action: PayloadAction<number | null>) => {
          state.cursorPosition = action.payload;
      },
    },
    extraReducers: (builder: any) => {
        builder.addCase(fetchAnotherSensorData.fulfilled, (state: any, action: PayloadAction<any[]>) => {
            state.data = action.payload;
        });
    },
});

// Exporta as actions geradas pelo slice
export const { setCursorPosition } = sensorSlice.actions;

// Seletores para acessar partes específicas do estado global
export const selectSensorData = (state: RootState) => state.sensor.data;
export const selectCursorPosition = (state: RootState) => state.sensor.cursorPosition;

export default sensorSlice.reducer;