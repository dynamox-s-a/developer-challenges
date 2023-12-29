import { createSlice } from '@reduxjs/toolkit';
import { TChart } from '../../common/types';

const initialState: TChart = {
  data: [],
  id: 'temperature',
  lines: [],
  name: '',
  title: 'Temperatura',
  yAxisTitle: 'Temperatura (°C)',
};

const temperatureSlice = createSlice({
  name: 'temperature',
  initialState,
  reducers: {
    setTemperatureData: (state, { payload }) => ({
      ...state,
      data: { ...state.data, payload },
    }),
    getTemperatureData: (state, { payload }) => {
      console.log('State: ', state, 'Payload: ', payload);
    },
  },
});

export const { getTemperatureData, setTemperatureData } =
  temperatureSlice.actions;
export default temperatureSlice;
