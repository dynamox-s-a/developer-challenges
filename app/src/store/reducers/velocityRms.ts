import { createSlice } from '@reduxjs/toolkit';
import { TChart } from '../../common/types';

const initialState: TChart = {
  data: [],
  id: 'velocityRms',
  lines: [],
  name: '',
  status: '',
  title: 'Velocidade RMS',
  yAxisTitle: 'Aceleração (g)',
};

const velocityRmsSlice = createSlice({
  name: 'velocityRms',
  initialState,
  reducers: {
    getVelocityRmsData: () => {},
    setVelocityRmsData: (state, { payload }) => ({
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

export const { getVelocityRmsData, setVelocityRmsData, setLines, setStatus } =
  velocityRmsSlice.actions;
export default velocityRmsSlice;
