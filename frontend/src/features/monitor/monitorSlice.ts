// import { SensorType } from '../../ListSensors';
import { MachineType } from '../../MachineCard';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export interface MonitorSliceState {
//   machines: MachineType[];
//   sensors: SensorType[];
//   statusM: 'idle' | 'loading' | 'failed';
//   statusS: 'idle' | 'loading' | 'failed';
// }

// const initialState: MonitorSliceState = {
//   machines: [],
//   sensors: [],
//   statusM: 'idle',
//   statusS: 'idle',
// };

type MachinesApiResponse = MachineType[];

export const machinesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/machines/' }),
  reducerPath: 'machinesApi',
  tagTypes: ['Machines'],
  endpoints: (build) => ({
    getMachines: build.query<MachinesApiResponse, string>({
      query: (userId: string | number) => `${userId}`,
    }),
  }),
});

export const { useGetMachinesQuery } = machinesApiSlice;

// export const monitorSlice = createAppSlice({
//   name: 'monitor',
//   initialState,
//   reducers: (create) => ({
//     loadMachines: create.asyncThunk(
//       async (userId: string | number) => {
//         const config = {
//           method: 'get',
//           maxBodyLength: Infinity,
//           url: `http://localhost:3001/machines/${userId}`,
//           headers: {},
//         };
//         const response = await axios.request(config);
//         console.log('loadMachines', response.data);
//         return response.data;
//       },
//       {
//         pending: (state) => {
//           state.statusM = 'loading';
//         },
//         fulfilled: (state, action) => {
//           state.statusM = 'idle';
//           state.machines = action.payload;
//         },
//         rejected: (state) => {
//           state.statusM = 'failed';
//         },
//       }
//     ),
//     loadSensors: create.asyncThunk(
//       async (machineId: string | number) => {
//         const config = {
//           method: 'get',
//           maxBodyLength: Infinity,
//           url: `http://localhost:3001/sensors/${machineId}`,
//           headers: {},
//         };
//         const response = await axios.request(config);
//         return response.data;
//       },
//       {
//         pending: (state) => {
//           state.statusS = 'loading';
//         },
//         fulfilled: (state, action) => {
//           state.statusS = 'idle';
//           state.sensors = action.payload;
//         },
//         rejected: (state) => {
//           state.statusS = 'failed';
//         },
//       }
//     ),
//   }),
//   selectors: {
//     selectMachines: (monitor) => monitor.machines,
//     selectSensors: (monitor) => monitor.sensors,
//     selectStatusM: (monitor) => monitor.statusM,
//     selectStatusS: (monitor) => monitor.statusS,
//   },
// });

// actions
// export const { loadMachines, loadSensors } = monitorSlice.actions;

// selectors
// export const { selectMachines, selectSensors, selectStatusM, selectStatusS } =
//   monitorSlice.selectors;
