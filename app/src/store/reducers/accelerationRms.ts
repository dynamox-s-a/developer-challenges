import { createSlice } from '@reduxjs/toolkit';
import { TChart } from '../../common/types';

const initialState: TChart = {
  data: [],
  id: 'accelerationRms',
  lines: [],
  name: '',
  title: 'Aceleração RMS',
  yAxisTitle: 'Aceleração RMS (g)',
};

const accelerationRmsSlice = createSlice({
  name: 'accelerationRms',
  initialState,
  reducers: {
    setAccelerationRmsData: (state, { payload }) => ({
      ...state,
      data: { ...state.data, payload },
    }),
    getAccelerationRmsData: (state, { payload }) => {
      console.log('State: ', state, 'Payload: ', payload);
    },
  },
});

export const { getAccelerationRmsData, setAccelerationRmsData } =
  accelerationRmsSlice.actions;
export default accelerationRmsSlice;
