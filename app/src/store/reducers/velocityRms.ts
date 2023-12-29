import { createSlice } from '@reduxjs/toolkit';
import { TChart } from '../../common/types';

const initialState: TChart = {
  data: [],
  id: 'velocityRms',
  lines: [],
  name: '',
  title: 'Velocidade RMS',
  yAxisTitle: 'Aceleração (g)',
};

const velocityRmsSlice = createSlice({
  name: 'velocityRms',
  initialState,
  reducers: {
    setVelocityRmsData: (state, { payload }) => ({
      ...state,
      data: { ...state.data, payload },
    }),
    getVelocityRmsData: (state, payload) => {
      console.log('State: ', state, 'Payload: ', payload);
    },
  },
});

export const { getVelocityRmsData, setVelocityRmsData } =
  velocityRmsSlice.actions;
export default velocityRmsSlice;
