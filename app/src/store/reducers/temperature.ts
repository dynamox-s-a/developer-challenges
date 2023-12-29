import { createSlice } from '@reduxjs/toolkit';
import { TChart } from '../../common/types';

const initialState: TChart = {
  data: [],
  id: 'temperature',
  lines: [],
  name: '',
  status: '',
  title: 'Temperatura',
  yAxisTitle: 'Temperatura (°C)',
};

const temperatureSlice = createSlice({
  name: 'temperature',
  initialState,
  reducers: {
    getTemperatureData: () => {},
    setTemperatureData: (state, { payload }) => ({
      ...state,
      data: { ...state.data, ...payload },
    }),
    setLines: (state, { payload }) => ({
      ...state,
      lines: state.lines.concat(payload),
    }),
    setStatus: (state, { payload }) => ({
      ...state,
      status: payload,
    }),
  },
});

export const { getTemperatureData, setTemperatureData, setLines, setStatus } =
  temperatureSlice.actions;
export default temperatureSlice;
