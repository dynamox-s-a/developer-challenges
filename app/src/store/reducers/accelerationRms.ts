import { createSlice } from '@reduxjs/toolkit';
import { TChart } from '../../common/types';

const initialState: TChart = {
  data: [],
  id: 'accelerationRms',
  lines: [],
  name: '',
  status: '',
  title: 'Aceleração RMS',
  yAxisTitle: 'Aceleração RMS (g)',
};

const accelerationRmsSlice = createSlice({
  name: 'accelerationRms',
  initialState,
  reducers: {
    getAccRmsData: () => {},
    setAccRmsData: (state, { payload }) => ({
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

export const { getAccRmsData, setAccRmsData, setLines, setStatus } =
  accelerationRmsSlice.actions;
export default accelerationRmsSlice;
